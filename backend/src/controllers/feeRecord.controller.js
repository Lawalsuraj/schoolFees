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


export const getStats = catchAsync(async (req, res, next) => {
  const totalStudents = await User.countDocuments({ role: 'student' });

  const overallResult = await FeeRecord.aggregate([
    { $group: { _id: null, totalDue: { $sum: '$amountDue' }, totalPaid: { $sum: '$amountPaid' } } },
  ]);
  const totalCollected = overallResult[0]?.totalPaid || 0;
  const totalOutstanding = overallResult[0] ? overallResult[0].totalDue - overallResult[0].totalPaid : 0;

  // Breakdown per class
  const classBreakdown = await FeeRecord.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'student',
        foreignField: '_id',
        as: 'studentInfo',
      },
    },
    { $unwind: '$studentInfo' },
    {
      $group: {
        _id: '$studentInfo.className',
        collected: { $sum: '$amountPaid' },
        due: { $sum: '$amountDue' },
      },
    },
    {
      $project: {
        _id: 0,
        className: '$_id',
        collected: 1,
        outstanding: { $subtract: ['$due', '$collected'] },
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: { totalStudents, totalCollected, totalOutstanding, classBreakdown },
  });
});


export const deleteFeeRecord = catchAsync(async (req, res, next) => {
  const feeRecord = await FeeRecord.findByIdAndDelete(req.params.id);
  if (!feeRecord) return next(new AppError('Fee record not found', 404));
  res.status(204).json({ status: 'success', data: null });
});