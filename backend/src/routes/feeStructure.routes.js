import express from 'express';
import {
  createFeeStructure,
  getAllFeeStructures,
  getFeeStructure,
  updateFeeStructure,
  deleteFeeStructure,
} from '../controllers/feeStructure.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { restrictTo } from '../middleware/restrictTo.middleware.js';

const router = express.Router();

router.use(protect, restrictTo('admin'));

router.post('/', createFeeStructure);
router.get('/', getAllFeeStructures);
router.get('/:id', getFeeStructure);
router.patch('/:id', updateFeeStructure);
router.delete('/:id', deleteFeeStructure);

export default router;