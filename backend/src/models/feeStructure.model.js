import mongoose from 'mongoose';

const feeStructureSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: true,
    },
    session: {
      type: String,
      required: true,
    },
    term: {
      type: String,
      enum: ['1st', '2nd', '3rd'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate fee structures for the same class/session/term
feeStructureSchema.index({ className: 1, session: 1, term: 1 }, { unique: true });

const FeeStructure = mongoose.model('FeeStructure', feeStructureSchema);

export default FeeStructure;