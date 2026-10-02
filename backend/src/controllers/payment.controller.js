
import crypto from 'crypto';
import axios from 'axios';
import Payment from '../models/payment.model.js';
import FeeRecord from '../models/feeRecord.model.js';
import catchAsync from '../utils/catchAsync.utils.js';
import AppError from '../utils/AppError.utils.js';

export const initiatePayment = catchAsync(async (req, res, next) => {
  const { feeRecordId } = req.body;

  const feeRecord = await FeeRecord.findById(feeRecordId);
  if (!feeRecord) return next(new AppError('Fee record not found', 404));

  // Ownership check — student can only pay their own fee record
  if (feeRecord.student.toString() !== req.user._id.toString()) {
    return next(new AppError('You are not authorized to pay this fee record', 403));
  }

  if (feeRecord.status === 'paid') {
    return next(new AppError('This fee has already been paid', 400));
  }

  const amountOwed = feeRecord.amountDue - feeRecord.amountPaid;

  const paystackRes = await axios.post(
    'https://api.paystack.co/transaction/initialize',
    {
      email: req.user.email,
      amount: amountOwed * 100,
    },
    {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    }
  );

  const { reference, authorization_url } = paystackRes.data.data;

  await Payment.create({
    feeRecord: feeRecord._id,
    student: req.user._id,
    reference,
    amount: amountOwed,
  });

  res.status(200).json({
    status: 'success',
    data: { authorizationUrl: authorization_url },
  });
});

export const handleWebhook = catchAsync(async (req, res, next) => {
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
    .update(req.body) // raw Buffer directly — not JSON.stringify
    .digest('hex');

  if (hash !== req.headers['x-paystack-signature']) {
    return res.status(401).json({ status: 'fail', message: 'Invalid signature' });
  }

  const event = JSON.parse(req.body); // manually parse now, since req.body is still a raw Buffer

  if (event.event === 'charge.success') {
    const { reference, amount } = event.data;

    const payment = await Payment.findOne({ reference });
    if (!payment) return res.status(200).send();

    if (payment.status === 'success') {
      return res.status(200).send();
    }

    payment.status = 'success';
    payment.paidAt = new Date();
    await payment.save();

    const feeRecord = await FeeRecord.findById(payment.feeRecord);
    feeRecord.amountPaid += amount / 100;
    feeRecord.status = feeRecord.amountPaid >= feeRecord.amountDue ? 'paid' : 'partial';
    await feeRecord.save();
  }

  res.status(200).send();
});


export const getMyPayments = catchAsync(async (req, res, next) => {
  const payments = await Payment.find({ student: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: payments.length,
    data: { payments },
  });
});