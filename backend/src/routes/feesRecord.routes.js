import express from 'express';
import {
  generateFeeRecords,
  getAllFeeRecords,
  getMyFeeRecords,
  getFeeRecord,
  deleteFeeRecord,
} from '../controllers/feeRecord.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { restrictTo } from '../middleware/restrictTo.middleware.js';

const router = express.Router();

router.get('/my-records', protect, getMyFeeRecords); // student route — must come before admin block below

router.use(protect, restrictTo('admin'));

router.post('/generate', generateFeeRecords);
router.get('/', getAllFeeRecords);
router.get('/:id', getFeeRecord);
router.delete('/:id', deleteFeeRecord);

export default router;