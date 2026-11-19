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
import validate from '../middleware/validate.middleware.js';
import { createStudentSchema } from '../validators/student.validator.js';

const router = express.Router();

// Checkpoints 1 and 2: run before EVERY route below this line
router.use(protect, restrictTo('admin'));

// Checkpoint 3 (validate) is added only where the request has a body to check
router.post('/', validate(createStudentSchema), createStudent);

router.get('/', getAllStudents);
router.get('/:id', getStudent);
router.patch('/:id', updateStudent);
router.patch('/:id/reset-password', resetStudentPassword);
router.delete('/:id', deleteStudent);

export default router;