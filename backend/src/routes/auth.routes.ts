import express from 'express';
import authController from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', protect, authController.logout);
router.post('/logout/all', protect, authController.logoutAll);
router.get('/me', protect, authController.getMe);

export default router;