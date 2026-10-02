import express from 'express';
import { register, login, refresh, getMe, logout } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/me', protect, getMe);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refresh);

export default router;