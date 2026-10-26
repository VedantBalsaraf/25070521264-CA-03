import { Router } from 'express';
import {
  getCommunityStats,
  getImpactStats,
  getImpactHistory,
  getLeaderboard,
  getChartData,
  exportImpactReport
} from '../controllers/impactController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/community-stats', getCommunityStats);
router.use(protect);

router.get('/stats', getImpactStats);
router.get('/history', getImpactHistory);
router.get('/leaderboard', getLeaderboard);
router.get('/charts', getChartData);
router.get('/export', exportImpactReport);

export default router;
