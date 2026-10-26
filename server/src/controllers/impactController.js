import BorrowRequest from '../models/BorrowRequest.js';
import Item from '../models/Item.js';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import mongoose from 'mongoose';

export const getCommunityStats = asyncHandler(async (req, res) => {
  const [itemsShared, activeBorrows, studentsConnected, reusedItems] = await Promise.all([
    Item.countDocuments({ status: { $ne: 'Removed' } }),
    BorrowRequest.countDocuments({ status: 'Active' }),
    User.countDocuments({ isActive: true }),
    BorrowRequest.distinct('item', { status: { $in: ['Returned', 'Active'] } })
  ]);

  res.json({
    success: true,
    data: {
      itemsShared,
      activeBorrows,
      studentsConnected,
      itemsReused: reusedItems.length
    }
  });
});

export const getImpactStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const completedBorrowStatuses = ['Returned', 'Active'];

  const [
    totalBorrows,
    reusedItemIds,
    co2Saved,
    communityScore,
    yourBorrows,
    yourShares
  ] = await Promise.all([
    BorrowRequest.countDocuments({ status: { $in: completedBorrowStatuses } }),
    BorrowRequest.distinct('item', { status: { $in: completedBorrowStatuses } }),
    calculateCO2Saved(),
    calculateCommunityScore(),
    BorrowRequest.countDocuments({ borrower: userId, status: { $in: completedBorrowStatuses } }),
    BorrowRequest.countDocuments({ owner: userId, status: { $in: completedBorrowStatuses } })
  ]);

  const itemsSaved = reusedItemIds.length;
  const netContribution = yourShares - yourBorrows;

  res.json({
    success: true,
    data: {
      totalBorrows,
      itemsSaved,
      co2Saved: Math.round(co2Saved * 10) / 10,
      communityScore,
      yourBorrows,
      yourShares,
      netContribution
    }
  });
});

export const getImpactHistory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const userId = req.user.id;

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const [history, total] = await Promise.all([
    BorrowRequest.find({
      $or: [
        { borrower: userId },
        { owner: userId }
      ],
      status: 'Returned'
    })
      .populate({
        path: 'item',
        select: 'title images category'
      })
      .populate({
        path: 'borrower',
        select: 'name rollNumber'
      })
      .sort({ returnedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10))
      .lean(),
    BorrowRequest.countDocuments({
      $or: [
        { borrower: userId },
        { owner: userId }
      ],
      status: 'Returned'
    })
  ]);

  res.json({
    success: true,
    data: {
      history,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        totalPages: Math.ceil(total / parseInt(limit, 10))
      }
    }
  });
});

export const getLeaderboard = asyncHandler(async (req, res) => {
  const topSharers = await User.aggregate([
    { $match: { isActive: true, totalShares: { $gt: 0 } } },
    {
      $project: {
        name: 1,
        rollNumber: 1,
        department: 1,
        year: 1,
        avatar: 1,
        sharesCount: '$totalShares',
        borrowsCount: '$totalBorrows',
        score: { $add: ['$totalShares', { $multiply: ['$totalBorrows', 0.5] }, '$trustScore'] }
      }
    },
    { $sort: { score: -1 } },
    { $limit: 10 }
  ]);

  const topBorrowers = await User.aggregate([
    { $match: { isActive: true, totalBorrows: { $gt: 0 } } },
    {
      $project: {
        name: 1,
        rollNumber: 1,
        department: 1,
        year: 1,
        avatar: 1,
        sharesCount: '$totalShares',
        borrowsCount: '$totalBorrows',
        score: { $add: ['$totalBorrows', { $multiply: ['$totalShares', 0.5] }, '$trustScore'] }
      }
    },
    { $sort: { score: -1 } },
    { $limit: 10 }
  ]);

  res.json({
    success: true,
    data: {
      topSharers,
      topBorrowers
    }
  });
});

export const getChartData = asyncHandler(async (req, res) => {
  const completedBorrowStatuses = ['Returned', 'Active'];
  const timeline = await BorrowRequest.aggregate([
    { $match: { status: { $in: completedBorrowStatuses }, borrowedAt: { $ne: null } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$borrowedAt' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: -1 } },
    { $limit: 12 },
    { $sort: { _id: 1 } }
  ]);

  const categoryDistribution = await Item.aggregate([
    { $match: { status: { $ne: 'Removed' } } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  const [borrowsByMonthRaw, listingsByMonthRaw] = await Promise.all([
    BorrowRequest.aggregate([
      { $match: { status: { $in: completedBorrowStatuses }, borrowedAt: { $ne: null } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$borrowedAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]),
    Item.aggregate([
      { $match: { status: { $ne: 'Removed' } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ])
  ]);

  const borrowsByMonth = Object.fromEntries(borrowsByMonthRaw.map(({ _id, count }) => [_id, count]));
  const listingsByMonth = Object.fromEntries(listingsByMonthRaw.map(({ _id, count }) => [_id, count]));

  const allMonths = [...new Set([...Object.keys(borrowsByMonth), ...Object.keys(listingsByMonth)])].sort().slice(-12);
  
  const formattedMonthlyActivity = allMonths.map(month => ({
    month,
    borrows: borrowsByMonth[month] || 0,
    listings: listingsByMonth[month] || 0
  }));

  res.json({
    success: true,
    data: {
      timeline: timeline.map(t => ({ date: t._id, count: t.count })),
      categoryDistribution: categoryDistribution.map(c => ({ category: c._id, count: c.count })),
      monthlyActivity: formattedMonthlyActivity
    }
  });
});

export const exportImpactReport = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId).lean();
  const stats = await getUserStats(userId);
  const history = await getUserHistory(userId);

  const report = {
    user: {
      name: user.name,
      rollNumber: user.rollNumber,
      department: user.department,
      year: user.year
    },
    generatedAt: new Date().toISOString(),
    stats,
    history
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="borrowcircles-impact-${new Date().toISOString().split('T')[0]}.json"`);
  res.send(JSON.stringify(report, null, 2));
});

async function calculateCO2Saved() {
  const result = await BorrowRequest.aggregate([
    { $match: { status: { $in: ['Returned', 'Active'] } } },
    {
      $lookup: {
        from: 'items',
        localField: 'item',
        foreignField: '_id',
        as: 'itemDoc'
      }
    },
    { $unwind: '$itemDoc' },
    {
      $group: {
        _id: '$itemDoc.category',
        count: { $sum: 1 }
      }
    }
  ]);

  // Illustrative per-borrow estimates in kg; this is a proxy, not a measured footprint.
  const co2PerCategory = {
    Books: 2.5,
    Electronics: 15,
    Tools: 5,
    Cameras: 20,
    Calculators: 1,
    'Project Equipment': 10,
    Other: 3
  };

  let totalCO2 = 0;
  result.forEach(item => {
    totalCO2 += (co2PerCategory[item._id] || 2) * item.count;
  });

  return totalCO2;
}

async function calculateCommunityScore() {
  const stats = await User.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: null,
        avgTrustScore: { $avg: '$trustScore' },
        totalUsers: { $sum: 1 },
        totalBorrows: { $sum: '$totalBorrows' },
        totalShares: { $sum: '$totalShares' }
      }
    }
  ]);

  if (stats.length === 0) return 100;

  const { avgTrustScore, totalUsers, totalBorrows, totalShares } = stats[0];
  const engagementRate = totalUsers > 0 ? (totalBorrows + totalShares) / totalUsers : 0;
  
  return Math.min(100, Math.round(avgTrustScore + engagementRate * 5));
}

async function getUserStats(userId) {
  const [borrows, shares, returnedBorrows, returnedShares] = await Promise.all([
    BorrowRequest.countDocuments({ borrower: userId, status: { $in: ['Returned', 'Active'] } }),
    BorrowRequest.countDocuments({ owner: userId, status: { $in: ['Returned', 'Active'] } }),
    BorrowRequest.countDocuments({ borrower: userId, status: 'Returned' }),
    BorrowRequest.countDocuments({ owner: userId, status: 'Returned' })
  ]);

  return { borrows, shares, returnedBorrows, returnedShares };
}

async function getUserHistory(userId) {
  return BorrowRequest.find({
    $or: [
      { borrower: userId },
      { owner: userId }
    ],
    status: 'Returned'
  })
    .populate({
      path: 'item',
      select: 'title images category'
    })
    .populate({
      path: 'borrower',
      select: 'name rollNumber'
    })
    .sort({ returnedAt: -1 })
    .lean();
}
