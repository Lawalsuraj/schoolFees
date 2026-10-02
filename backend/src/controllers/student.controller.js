import User from '../models/user.model.js';
import catchAsync from '../utils/catchAsync.utils.js';
import AppError from '../utils/AppError.utils.js';

export const createStudent = catchAsync(async (req, res, next) => {
  const { name, email, password, className } = req.body;

  const student = await User.create({ name, email, password, className, role: 'student' });

  res.status(201).json({
    status: 'success',
    data: { student: { id: student._id, name: student.name, email: student.email, className: student.className } },
  });
});

export const getAllStudents = catchAsync(async (req, res, next) => {
  const students = await User.find({ role: 'student' }).select('name email className');

  res.status(200).json({
    status: 'success',
    results: students.length,
    data: { students },
  });
});

export const getStudent = catchAsync(async (req, res, next) => {
  const student = await User.findOne({ _id: req.params.id, role: 'student' }).select('name email className');

  if (!student) return next(new AppError('Student not found', 404));

  res.status(200).json({ status: 'success', data: { student } });
});

export const updateStudent = catchAsync(async (req, res, next) => {
  const { name, email, className } = req.body; // no password or role here — separate concerns

  const student = await User.findOneAndUpdate(
    { _id: req.params.id, role: 'student' },
    { name, email, className },
    { new: true, runValidators: true }
  ).select('name email className');

  if (!student) return next(new AppError('Student not found', 404));

  res.status(200).json({ status: 'success', data: { student } });
});





export const resetStudentPassword = catchAsync(async (req, res, next) => {
  const { newPassword } = req.body;

  const student = await User.findOne({ _id: req.params.id, role: 'student' });
  if (!student) return next(new AppError('Student not found', 404));

  student.password = newPassword; // triggers the pre('save') hash hook
  await student.save();

  res.status(200).json({ status: 'success', message: 'Password reset successfully' });
});


export const deleteStudent = catchAsync(async (req, res, next) => {
  const student = await User.findOneAndDelete({ _id: req.params.id, role: 'student' });

  if (!student) return next(new AppError('Student not found', 404));

  res.status(204).json({ status: 'success', data: null });
});