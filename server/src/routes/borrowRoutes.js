import { Router } from 'express';
import {
  createBorrowRequest,
  getSentRequests,
  getReceivedRequests,
  approveRequest,
  rejectRequest,
  markAsBorrowed,
  confirmReturn,
  cancelRequest,
  getBorrowRequest
} from '../controllers/borrowController.js';
import { protect } from '../middleware/auth.js';
import { validate, borrowRequestSchema, approveRejectSchema, returnSchema } from '../middleware/validation.js';

const router = Router();

router.use(protect);

router.post('/request', validate(borrowRequestSchema), createBorrowRequest);
router.get('/sent', getSentRequests);
router.get('/received', getReceivedRequests);
router.get('/:id', getBorrowRequest);
router.put('/:id/approve', validate(approveRejectSchema), approveRequest);
router.put('/:id/reject', validate(approveRejectSchema), rejectRequest);
router.put('/:id/borrow', markAsBorrowed);
router.put('/:id/return', validate(returnSchema), confirmReturn);
router.put('/:id/cancel', cancelRequest);

export default router;