import { Router } from 'express';
import {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  getMyItems,
  getFeaturedItems,
  getCategories,
  searchItems,
  updateItemStatus
} from '../controllers/itemController.js';
import { protect } from '../middleware/auth.js';
import { validate, itemSchema, updateItemSchema, itemStatusSchema } from '../middleware/validation.js';

const router = Router();

router.get('/', getItems);
router.get('/featured', getFeaturedItems);
router.get('/categories', getCategories);
router.get('/search', searchItems);
router.get('/my-items', protect, getMyItems);
router.patch('/:id/status', protect, validate(itemStatusSchema), updateItemStatus);
router.get('/:id', getItem);
router.post('/', protect, validate(itemSchema), createItem);
router.put('/:id', protect, validate(updateItemSchema), updateItem);
router.delete('/:id', protect, deleteItem);

export default router;
