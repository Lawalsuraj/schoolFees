import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { getReceipt } from '../controllers/reciept.controller.js';

const router = express.Router();

router.get('/:paymentId', protect, getReceipt);

export default router;