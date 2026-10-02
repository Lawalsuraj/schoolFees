import FeeStructure from '../models/feeStructure.model.js';
import catchAsync from '../utils/catchAsync.utils.js';
import AppError from '../utils/AppError.utils.js';

export const createFeeStructure = catchAsync(async (req, res, next) => {
  const { className, session, term, amount } = req.body;
  const feeStructure = await FeeStructure.create({ className, session, term, amount });
  res.status(201).json({ status: 'success', data: { feeStructure } });
});

export const getAllFeeStructures = catchAsync(async (req, res, next) => {
  const feeStructures = await FeeStructure.find();
  res.status(200).json({
    status: 'success',
    results: feeStructures.length,
    data: { feeStructures },
  });
});

export const getFeeStructure = catchAsync(async (req, res, next) => {
  const feeStructure = await FeeStructure.findById(req.params.id);
  if (!feeStructure) return next(new AppError('Fee structure not found', 404));
  res.status(200).json({ status: 'success', data: { feeStructure } });
});

export const updateFeeStructure = catchAsync(async (req, res, next) => {
  const { amount } = req.body; // only amount should be editable — changing className/session/term should mean creating a NEW structure, not mutating this one

  const feeStructure = await FeeStructure.findByIdAndUpdate(
    req.params.id,
    { amount },
    { new: true, runValidators: true }
  );

  if (!feeStructure) return next(new AppError('Fee structure not found', 404));
  res.status(200).json({ status: 'success', data: { feeStructure } });
});

export const deleteFeeStructure = catchAsync(async (req, res, next) => {
  const feeStructure = await FeeStructure.findByIdAndDelete(req.params.id);
  if (!feeStructure) return next(new AppError('Fee structure not found', 404));
  res.status(204).json({ status: 'success', data: null });
});