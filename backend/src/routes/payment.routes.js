import express from 'express';
import { getMyPayments, getPaymentStatus, handleWebhook, initiatePayment } from '../controllers/payment.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();


router.get('/my-payments', protect, getMyPayments);
router.get('/status/:reference', protect, getPaymentStatus);
router.post('/initiate', protect, initiatePayment);
router.post('/webhook', handleWebhook);

export default router;