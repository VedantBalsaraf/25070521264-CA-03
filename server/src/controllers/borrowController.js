import BorrowRequest from '../models/BorrowRequest.js';
import Item from '../models/Item.js';
import User from '../models/User.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import mongoose from 'mongoose';

const REQUESTS_PER_PAGE = 10;

export const createBorrowRequest = asyncHandler(async (req, res) => {
  const { itemId, notes, dueDate } = req.body;

  if (!itemId || !dueDate) {
    throw new AppError('Item ID and due date are required', 400);
  }

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    throw new AppError('Invalid item ID', 400);
  }

  const item = await Item.findById(itemId);

  if (!item) {
    throw new AppError('Item not found', 404);
  }

  if (item.status !== 'Available') {
    throw new AppError('Item is not available for borrowing', 400);
  }

  if (item.owner.toString() === req.user.id) {
    throw new AppError('You cannot borrow your own item', 400);
  }

  const existingRequest = await BorrowRequest.findOne({
    item: itemId,
    borrower: req.user.id,
    status: { $in: ['Pending', 'Approved', 'Active'] }
  });

  if (existingRequest) {
    throw new AppError('You already have an active request for this item', 400);
  }

  const due = new Date(dueDate);
  if (due <= new Date()) {
    throw new AppError('Due date must be in the future', 400);
  }

  const borrowRequest = await BorrowRequest.create({
    item: itemId,
    borrower: req.user.id,
    owner: item.owner,
    dueDate: due,
    notes: notes || ''
  });

  await borrowRequest.populate([
    { path: 'item', select: 'title images category owner location' },
    { path: 'borrower', select: 'name rollNumber department year avatar' },
    { path: 'owner', select: 'name rollNumber department year avatar' }
  ]);

  res.status(201).json({
    success: true,
    message: 'Borrow request sent successfully',
    data: { request: borrowRequest }
  });
});

export const getSentRequests = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = REQUESTS_PER_PAGE } = req.query;

  const query = { borrower: req.user.id };

  if (status) {
    query.status = status;
  }

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const [requests, total] = await Promise.all([
    BorrowRequest.find(query)
      .populate([
        { path: 'item', select: 'title images category owner location' },
        { path: 'borrower', select: 'name rollNumber department year avatar' },
        { path: 'owner', select: 'name rollNumber department year avatar' }
      ])
      .sort({ requestedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10))
      .lean(),
    BorrowRequest.countDocuments(query)
  ]);

  res.json({
    success: true,
    data: {
      requests,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        totalPages: Math.ceil(total / parseInt(limit, 10))
      }
    }
  });
});

export const getReceivedRequests = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = REQUESTS_PER_PAGE } = req.query;

  const query = { owner: req.user.id };

  if (status) {
    query.status = status;
  }

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const [requests, total] = await Promise.all([
    BorrowRequest.find(query)
      .populate([
        { path: 'item', select: 'title images category owner location' },
        { path: 'borrower', select: 'name rollNumber department year avatar' },
        { path: 'owner', select: 'name rollNumber department year avatar' }
      ])
      .sort({ requestedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10))
      .lean(),
    BorrowRequest.countDocuments(query)
  ]);

  res.json({
    success: true,
    data: {
      requests,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        totalPages: Math.ceil(total / parseInt(limit, 10))
      }
    }
  });
});

export const approveRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid request ID', 400);
  }

  const request = await BorrowRequest.findById(id).populate('item');

  if (!request) {
    throw new AppError('Request not found', 404);
  }

  if (request.owner.toString() !== req.user.id) {
    throw new AppError('Not authorized to approve this request', 403);
  }

  if (request.status !== 'Pending') {
    throw new AppError('Request is not pending', 400);
  }

  // Reserve the item atomically so only one pending request can be approved.
  const reservedItem = await Item.findOneAndUpdate(
    { _id: request.item._id, status: 'Available' },
    { $set: { status: 'Reserved' } },
    { new: true }
  );

  if (!reservedItem) {
    throw new AppError('This item is no longer available to approve', 409);
  }

  const approvedRequest = await BorrowRequest.findOneAndUpdate(
    { _id: id, owner: req.user.id, status: 'Pending' },
    { $set: { status: 'Approved', approvedAt: new Date() } },
    { new: true, runValidators: true }
  );

  if (!approvedRequest) {
    await Item.findOneAndUpdate(
      { _id: reservedItem._id, status: 'Reserved' },
      { $set: { status: 'Available' } }
    );
    throw new AppError('This request is no longer pending', 409);
  }

  await approvedRequest.populate([
    { path: 'item', select: 'title images category owner location' },
    { path: 'borrower', select: 'name rollNumber department year avatar' },
    { path: 'owner', select: 'name rollNumber department year avatar' }
  ]);

  res.json({
    success: true,
    message: 'Request approved successfully',
    data: { request: approvedRequest }
  });
});

export const rejectRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid request ID', 400);
  }

  const request = await BorrowRequest.findById(id).populate('item');

  if (!request) {
    throw new AppError('Request not found', 404);
  }

  if (request.owner.toString() !== req.user.id) {
    throw new AppError('Not authorized to reject this request', 403);
  }

  if (request.status !== 'Pending') {
    throw new AppError('Request is not pending', 400);
  }

  const rejectedRequest = await BorrowRequest.findOneAndUpdate(
    { _id: id, owner: req.user.id, status: 'Pending' },
    { $set: { status: 'Rejected', rejectionReason: reason || '' } },
    { new: true, runValidators: true }
  );

  if (!rejectedRequest) {
    throw new AppError('This request is no longer pending', 409);
  }

  await rejectedRequest.populate([
    { path: 'item', select: 'title images category owner location' },
    { path: 'borrower', select: 'name rollNumber department year avatar' },
    { path: 'owner', select: 'name rollNumber department year avatar' }
  ]);

  res.json({
    success: true,
    message: 'Request rejected',
    data: { request: rejectedRequest }
  });
});

export const markAsBorrowed = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid request ID', 400);
  }

  const request = await BorrowRequest.findById(id).populate('item');

  if (!request) {
    throw new AppError('Request not found', 404);
  }

  if (request.owner.toString() !== req.user.id) {
    throw new AppError('Not authorized to mark as borrowed', 403);
  }

  if (request.status !== 'Approved') {
    throw new AppError('Request must be approved first', 400);
  }

  const activeRequest = await BorrowRequest.findOneAndUpdate(
    { _id: id, owner: req.user.id, status: 'Approved' },
    { $set: { status: 'Active', borrowedAt: new Date() } },
    { new: true, runValidators: true }
  );

  if (!activeRequest) {
    throw new AppError('This request is no longer approved', 409);
  }

  const borrowedItem = await Item.findOneAndUpdate(
    { _id: request.item._id, status: 'Reserved' },
    { $set: { status: 'Borrowed' }, $inc: { borrowCount: 1 } },
    { new: true }
  );

  if (!borrowedItem) {
    await BorrowRequest.findOneAndUpdate(
      { _id: id, status: 'Active' },
      { $set: { status: 'Approved', borrowedAt: null } }
    );
    throw new AppError('The item reservation could not be confirmed. Please retry.', 409);
  }

  await activeRequest.populate([
    { path: 'item', select: 'title images category owner location' },
    { path: 'borrower', select: 'name rollNumber department year avatar' },
    { path: 'owner', select: 'name rollNumber department year avatar' }
  ]);

  res.json({
    success: true,
    message: 'Item marked as borrowed',
    data: { request: activeRequest }
  });
});

export const confirmReturn = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { notes } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid request ID', 400);
  }

  const request = await BorrowRequest.findById(id).populate('item');

  if (!request) {
    throw new AppError('Request not found', 404);
  }

  if (request.owner.toString() !== req.user.id) {
    throw new AppError('Not authorized to confirm return', 403);
  }

  if (request.status !== 'Active') {
    throw new AppError('Item is not currently borrowed', 400);
  }

  const returnedRequest = await BorrowRequest.findOneAndUpdate(
    { _id: id, owner: req.user.id, status: 'Active' },
    { $set: { status: 'Returned', returnedAt: new Date(), returnNotes: notes || '' } },
    { new: true, runValidators: true }
  );

  if (!returnedRequest) {
    throw new AppError('This borrow is no longer active', 409);
  }

  const releasedItem = await Item.findOneAndUpdate(
    { _id: request.item._id, status: 'Borrowed' },
    { $set: { status: 'Available' } },
    { new: true }
  );

  if (!releasedItem) {
    await BorrowRequest.findOneAndUpdate(
      { _id: id, status: 'Returned' },
      { $set: { status: 'Active', returnedAt: null, returnNotes: '' } }
    );
    throw new AppError('The item could not be released. Please retry.', 409);
  }

  await Promise.all([
    User.updateOne({ _id: request.borrower }, { $inc: { totalBorrows: 1 } }),
    User.updateOne({ _id: request.owner }, { $inc: { totalShares: 1 } })
  ]);

  await returnedRequest.populate([
    { path: 'item', select: 'title images category owner location' },
    { path: 'borrower', select: 'name rollNumber department year avatar' },
    { path: 'owner', select: 'name rollNumber department year avatar' }
  ]);

  res.json({
    success: true,
    message: 'Return confirmed successfully',
    data: { request: returnedRequest }
  });
});

export const cancelRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid request ID', 400);
  }

  const request = await BorrowRequest.findById(id).populate('item');

  if (!request) {
    throw new AppError('Request not found', 404);
  }

  if (request.borrower.toString() !== req.user.id) {
    throw new AppError('Not authorized to cancel this request', 403);
  }

  if (!['Pending', 'Approved'].includes(request.status)) {
    throw new AppError('Cannot cancel this request', 400);
  }

  const wasApproved = request.status === 'Approved';
  const cancelledRequest = await BorrowRequest.findOneAndUpdate(
    { _id: id, borrower: req.user.id, status: { $in: ['Pending', 'Approved'] } },
    { $set: { status: 'Cancelled' } },
    { new: true, runValidators: true }
  );

  if (!cancelledRequest) {
    throw new AppError('This request can no longer be cancelled', 409);
  }

  if (wasApproved) {
    const released = await Item.findOneAndUpdate(
      { _id: request.item._id, status: 'Reserved' },
      { $set: { status: 'Available' } },
      { new: true }
    );

    if (!released) {
      await BorrowRequest.findOneAndUpdate(
        { _id: id, status: 'Cancelled' },
        { $set: { status: 'Approved' } }
      );
      throw new AppError('The item reservation could not be released. Please retry.', 409);
    }
  }

  await cancelledRequest.populate([
    { path: 'item', select: 'title images category owner location' },
    { path: 'borrower', select: 'name rollNumber department year avatar' },
    { path: 'owner', select: 'name rollNumber department year avatar' }
  ]);

  res.json({
    success: true,
    message: 'Request cancelled',
    data: { request: cancelledRequest }
  });
});

export const getBorrowRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid request ID', 400);
  }

  const request = await BorrowRequest.findById(id)
    .populate([
      { path: 'item', select: 'title images category owner location status borrowCount' },
      { path: 'borrower', select: 'name rollNumber department year avatar' },
      { path: 'owner', select: 'name rollNumber department year avatar' }
    ])
    .lean();

  if (!request) {
    throw new AppError('Request not found', 404);
  }

  if (request.borrower._id.toString() !== req.user.id && request.owner._id.toString() !== req.user.id) {
    throw new AppError('Not authorized to view this request', 403);
  }

  res.json({
    success: true,
    data: { request }
  });
});
