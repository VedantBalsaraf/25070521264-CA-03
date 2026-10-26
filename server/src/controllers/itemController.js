import Item from '../models/Item.js';
import BorrowRequest from '../models/BorrowRequest.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import mongoose from 'mongoose';

const ITEMS_PER_PAGE = 12;

export const getItems = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    condition,
    status,
    location,
    owner,
    page = 1,
    limit = ITEMS_PER_PAGE,
    sort = 'createdAt',
    order = 'desc'
  } = req.query;

  const query = {};

  if (search) {
    query.$text = { $search: search };
  }

  if (category) {
    query.category = category;
  }

  if (condition) {
    query.condition = condition;
  }

  if (status) {
    query.status = status;
  } else {
    query.status = { $ne: 'Removed' };
  }

  if (location) {
    query.location = { $regex: location, $options: 'i' };
  }

  if (owner) {
    query.owner = owner;
  }

  const sortOrder = order === 'asc' ? 1 : -1;
  const sortObj = {};
  sortObj[sort] = sortOrder;

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const [items, total] = await Promise.all([
    Item.find(query)
      .populate('owner', 'name rollNumber department year avatar')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit, 10))
      .lean(),
    Item.countDocuments(query)
  ]);

  res.json({
    success: true,
    data: {
      items,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        totalPages: Math.ceil(total / parseInt(limit, 10))
      }
    }
  });
});

export const getItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid item ID', 400);
  }

  const item = await Item.findById(id)
    .populate('owner', 'name rollNumber department year avatar')
    .lean();

  if (!item) {
    throw new AppError('Item not found', 404);
  }

  await Item.findByIdAndUpdate(id, { $inc: { views: 1 } });

  res.json({
    success: true,
    data: { item }
  });
});

export const createItem = asyncHandler(async (req, res) => {
  const { title, description, category, condition, location, tags, images, availability } = req.body;

  const item = await Item.create({
    title: title.trim(),
    description: description.trim(),
    category,
    condition,
    location: location.trim(),
    tags: tags || [],
    images: images || [],
    availability: availability || 'always',
    owner: req.user.id
  });

  await item.populate('owner', 'name rollNumber department year avatar');

  res.status(201).json({
    success: true,
    message: 'Item created successfully',
    data: { item }
  });
});

export const updateItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid item ID', 400);
  }

  const item = await Item.findById(id);

  if (!item) {
    throw new AppError('Item not found', 404);
  }

  if (item.owner.toString() !== req.user.id) {
    throw new AppError('Not authorized to update this item', 403);
  }

  const allowedUpdates = ['title', 'description', 'category', 'condition', 'location', 'tags', 'images', 'availability'];
  const filteredUpdates = {};
  
  allowedUpdates.forEach(key => {
    if (updates[key] !== undefined) {
      filteredUpdates[key] = updates[key];
    }
  });

  const updatedItem = await Item.findByIdAndUpdate(
    id,
    filteredUpdates,
    { new: true, runValidators: true }
  ).populate('owner', 'name rollNumber department year avatar');

  res.json({
    success: true,
    message: 'Item updated successfully',
    data: { item: updatedItem }
  });
});

export const updateItemStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid item ID', 400);
  }

  const item = await Item.findById(id);
  if (!item) throw new AppError('Item not found', 404);
  if (item.owner.toString() !== req.user.id) {
    throw new AppError('Not authorized to update this item', 403);
  }

  if (!['Available', 'Maintenance'].includes(item.status)) {
    throw new AppError('Reserved or borrowed items can only change status through the borrow workflow', 409);
  }

  const updatedItem = await Item.findOneAndUpdate(
    { _id: id, owner: req.user.id, status: { $in: ['Available', 'Maintenance'] } },
    { $set: { status } },
    { new: true, runValidators: true }
  ).populate('owner', 'name rollNumber department year avatar');

  if (!updatedItem) {
    throw new AppError('Item status changed while you were editing. Refresh and try again.', 409);
  }

  res.json({
    success: true,
    message: `Item marked ${status.toLowerCase()}`,
    data: { item: updatedItem }
  });
});

export const deleteItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid item ID', 400);
  }

  const item = await Item.findById(id);

  if (!item) {
    throw new AppError('Item not found', 404);
  }

  if (item.owner.toString() !== req.user.id) {
    throw new AppError('Not authorized to delete this item', 403);
  }

  const activeRequest = await BorrowRequest.exists({
    item: id,
    status: { $in: ['Pending', 'Approved', 'Active'] }
  });

  if (activeRequest) {
    throw new AppError('Resolve pending or active borrow requests before removing this item', 409);
  }

  // Preserve completed request history and references instead of hard deleting.
  await Item.findByIdAndUpdate(id, { $set: { status: 'Removed' } });

  res.json({
    success: true,
    message: 'Item deleted successfully'
  });
});

export const getMyItems = asyncHandler(async (req, res) => {
  const {
    status,
    page = 1,
    limit = ITEMS_PER_PAGE,
    sort = 'createdAt',
    order = 'desc'
  } = req.query;

  const query = { owner: req.user.id };

  if (status) {
    query.status = status;
  }

  const sortOrder = order === 'asc' ? 1 : -1;
  const sortObj = { [sort]: sortOrder };

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const [items, total] = await Promise.all([
    Item.find(query)
      .populate('owner', 'name rollNumber department year avatar')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit, 10))
      .lean(),
    Item.countDocuments(query)
  ]);

  res.json({
    success: true,
    data: {
      items,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        totalPages: Math.ceil(total / parseInt(limit, 10))
      }
    }
  });
});

export const getFeaturedItems = asyncHandler(async (req, res) => {
  const { limit = 4 } = req.query;

  const items = await Item.find({ status: 'Available' })
    .populate('owner', 'name rollNumber department year avatar')
    .sort({ borrowCount: -1, createdAt: -1 })
    .limit(parseInt(limit, 10))
    .lean();

  res.json({
    success: true,
    data: { items }
  });
});

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Item.aggregate([
    { $match: { status: 'Available' } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  res.json({
    success: true,
    data: { categories }
  });
});

export const searchItems = asyncHandler(async (req, res) => {
  const { q, category, condition, page = 1, limit = ITEMS_PER_PAGE } = req.query;

  if (!q) {
    throw new AppError('Search query is required', 400);
  }

  const query = {
    $text: { $search: q },
    status: { $ne: 'Removed' }
  };

  if (category) query.category = category;
  if (condition) query.condition = condition;

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const [items, total] = await Promise.all([
    Item.find(query, { score: { $meta: 'textScore' } })
      .populate('owner', 'name rollNumber department year avatar')
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(parseInt(limit, 10))
      .lean(),
    Item.countDocuments(query)
  ]);

  res.json({
    success: true,
    data: {
      items,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        totalPages: Math.ceil(total / parseInt(limit, 10))
      }
    }
  });
});
