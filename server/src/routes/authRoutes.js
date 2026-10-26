import { Router } from 'express';
import { signup, login, getMe, updateProfile, changePassword, logout } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate, signupSchema, loginSchema } from '../middleware/validation.js';

const router = Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);
router.post('/logout', protect, logout);

export default router;