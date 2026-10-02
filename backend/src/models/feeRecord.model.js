import mongoose from 'mongoose';

const feeRecordSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    feeStructure: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FeeStructure',
      required: true,
    },
    amountDue: {
      type: Number,
      required: true,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['unpaid', 'partial', 'paid'],
      default: 'unpaid',
    },
    session: {
      type: String,
      required: true,
    },
    term: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate fee records for the same student/session/term
feeRecordSchema.index({ student: 1, session: 1, term: 1 }, { unique: true });

const FeeRecord = mongoose.model('FeeRecord', feeRecordSchema);

export default FeeRecord;