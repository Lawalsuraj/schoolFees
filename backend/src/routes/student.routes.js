import express from 'express';
import {
  createStudent,
  getAllStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  resetStudentPassword,
} from '../controllers/student.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { restrictTo } from '../middleware/restrictTo.middleware.js';

const router = express.Router();

router.use(protect, restrictTo('admin')); // applies to every route below

router.post('/', createStudent);
router.get('/', getAllStudents);
router.get('/:id', getStudent);
router.patch('/:id', updateStudent);
router.patch('/:id/reset-password', resetStudentPassword);
router.delete('/:id', deleteStudent);

export default router;