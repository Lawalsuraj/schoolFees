import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    feeRecord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FeeRecord',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reference: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'pending',
    },
    paidAt: Date,
  },
  { timestamps: true }
);

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;