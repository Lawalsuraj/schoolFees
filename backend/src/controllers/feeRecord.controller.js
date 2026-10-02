import FeeRecord from '../models/feeRecord.model.js';
import FeeStructure from '../models/feeStructure.model.js';
import User from '../models/user.model.js';
import catchAsync from '../utils/catchAsync.utils.js';
import AppError from '../utils/AppError.utils.js';

export const generateFeeRecords = catchAsync(async (req, res, next) => {
  const { feeStructureId } = req.body;

  const feeStructure = await FeeStructure.findById(feeStructureId);
  if (!feeStructure) return next(new AppError('Fee structure not found', 404));

  const students = await User.find({ role: 'student', className: feeStructure.className });

  const records = await Promise.all(
    students.map((student) =>
      FeeRecord.create({
        student: student._id,
        feeStructure: feeStructure._id,
        amountDue: feeStructure.amount,
        session: feeStructure.session,
        term: feeStructure.term,
      }).catch(() => null) // skip students who already have this record (duplicate key)
    )
  );

  const created = records.filter(Boolean);

  res.status(201).json({
    status: 'success',
    results: created.length,
    data: { feeRecords: created },
  });
});

export const getAllFeeRecords = catchAsync(async (req, res, next) => {
  const feeRecords = await FeeRecord.find()
    .populate('student', 'name email className')
    .populate('feeStructure', 'className session term amount');

  res.status(200).json({
    status: 'success',
    results: feeRecords.length,
    data: { feeRecords },
  });
});

export const getMyFeeRecords = catchAsync(async (req, res, next) => {
  const feeRecords = await FeeRecord.find({ student: req.user._id })
    .populate('feeStructure', 'className session term amount');

  res.status(200).json({
    status: 'success',
    results: feeRecords.length,
    data: { feeRecords },
  });
});

export const getFeeRecord = catchAsync(async (req, res, next) => {
  const feeRecord = await FeeRecord.findById(req.params.id)
    .populate('student', 'name email className')
    .populate('feeStructure', 'className session term amount');

  if (!feeRecord) return next(new AppError('Fee record not found', 404));

  res.status(200).json({ status: 'success', data: { feeRecord } });
});

export const deleteFeeRecord = catchAsync(async (req, res, next) => {
  const feeRecord = await FeeRecord.findByIdAndDelete(req.params.id);
  if (!feeRecord) return next(new AppError('Fee record not found', 404));
  res.status(204).json({ status: 'success', data: null });
});