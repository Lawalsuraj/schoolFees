import express from 'express';
import { getMyPayments, handleWebhook, initiatePayment } from '../controllers/payment.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();


router.get('/my-payments', protect, getMyPayments);
router.post('/initiate', protect, initiatePayment);
router.post('/webhook', handleWebhook);

export default router;