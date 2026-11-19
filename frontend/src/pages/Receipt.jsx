import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Logo from '../components/Logo.jsx';
import { getReceipt } from '../api/receipt.api.js';

const Receipt = () => {
  const { paymentId } = useParams();
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const res = await getReceipt(paymentId);
        setReceipt(res.data.data.receipt);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load receipt');
      } finally {
        setLoading(false);
      }
    };
    fetchReceipt();
  }, [paymentId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-error">{error}</p>
        <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-6 print:bg-white print:p-0">
      <div className="max-w-xl mx-auto card bg-base-100 shadow-xl print:shadow-none">
        <div className="card-body">
          <div className="flex justify-between items-center border-b border-base-300 pb-4">
            <Logo size="text-xl" />
            <span className="text-sm font-semibold uppercase tracking-wide">Payment Receipt</span>
          </div>

          <div className="grid grid-cols-2 gap-y-3 text-sm py-4">
            <span className="text-base-content/60">Student</span>
            <span className="font-medium">{receipt.studentName}</span>

            <span className="text-base-content/60">Email</span>
            <span>{receipt.studentEmail}</span>

            <span className="text-base-content/60">Session / Term</span>
            <span>{receipt.session}, {receipt.term} Term</span>

            <span className="text-base-content/60">Date Paid</span>
            <span>{new Date(receipt.paidAt).toLocaleString()}</span>

            <span className="text-base-content/60">Reference</span>
            <span className="break-all">{receipt.reference}</span>
          </div>

          <div className="flex justify-between items-center border-t border-base-300 pt-4">
            <span className="font-semibold">Amount Paid</span>
            <span className="text-2xl font-bold text-success">
              ₦{receipt.amountPaid.toLocaleString()}
            </span>
          </div>

          <div className="flex gap-2 mt-6 print:hidden">
            <button className="btn btn-primary flex-1" onClick={() => window.print()}>
              Print Receipt
            </button>
            <Link to="/dashboard" className="btn btn-outline flex-1">
              Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;