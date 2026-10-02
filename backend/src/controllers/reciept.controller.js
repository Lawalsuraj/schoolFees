import Payment from '../models/payment.model.js';
import FeeRecord from '../models/feeRecord.model.js';
import catchAsync from '../utils/catchAsync.utils.js';
import AppError from '../utils/AppError.utils.js';

export const getReceipt = catchAsync(async (req, res, next) => {
  const { paymentId } = req.params;

  const payment = await Payment.findById(paymentId).populate('student', 'name email');

  if (!payment) return next(new AppError('Payment not found', 404));

  // Ownership check — student can only view their own receipt
  if (payment.student._id.toString() !== req.user._id.toString()) {
    return next(new AppError('You are not authorized to view this receipt', 403));
  }

  if (payment.status !== 'success') {
    return next(new AppError('Receipt not available — payment not yet confirmed', 400));
  }

  const feeRecord = await FeeRecord.findById(payment.feeRecord);

  res.status(200).json({
    status: 'success',
    data: {
      receipt: {
        studentName: payment.student.name,
        studentEmail: payment.student.email,
        reference: payment.reference,
        amountPaid: payment.amount,
        paidAt: payment.paidAt,
        session: feeRecord.session,
        term: feeRecord.term,
      },
    },
  });
});