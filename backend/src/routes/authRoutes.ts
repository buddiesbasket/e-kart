import { Router } from 'express';
import { register, login, getCurrentUser, logout, logoutAll } from '@controllers/authController';
import { auth } from '@middlewares/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', auth, logout);
router.post('/logout/all', auth, logoutAll);
router.get('/user', auth, getCurrentUser);

export default router;