import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import { getPaymentStatus } from '../api/payment.api.js';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference');

  const [status, setStatus] = useState('checking'); // checking | success | failed | pending | error
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    if (!reference) {
      setStatus('error');
      return;
    }

    let attempts = 0;
    let timer;

    const check = async () => {
      try {
        const res = await getPaymentStatus(reference);
        const p = res.data.data.payment;
        setPayment(p);

        if (p.status === 'success') return setStatus('success');
        if (p.status === 'failed') return setStatus('failed');
      } catch (err) {
        return setStatus('error');
      }

      attempts++;
      if (attempts >= 5) {
        setStatus('pending'); // webhook still hasn't arrived after ~10 seconds
      } else {
        timer = setTimeout(check, 2000); // try again in 2 seconds
      }
    };

    check();
    return () => clearTimeout(timer); // cleanup if the user leaves the page
  }, [reference]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          {status === 'checking' && (
            <>
              <span className="loading loading-spinner loading-lg"></span>
              <h2 className="card-title mt-2">Confirming your payment...</h2>
              <p className="text-sm text-base-content/70">Please don't close this page.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <FaCheckCircle className="text-6xl text-success" />
              <h2 className="card-title mt-2">Payment Successful</h2>
              <p className="text-sm text-base-content/70">
                ₦{payment.amount.toLocaleString()} paid for {payment.feeRecord?.term} Term,{' '}
                {payment.feeRecord?.session}.
              </p>
              <p className="text-xs text-base-content/50">Reference: {payment.reference}</p>
              <Link to={`/receipt/${payment._id}`} className="btn btn-outline btn-sm mt-2">
                View Receipt
              </Link>
            </>
          )}

          {status === 'failed' && (
            <>
              <FaTimesCircle className="text-6xl text-error" />
              <h2 className="card-title mt-2">Payment Failed</h2>
              <p className="text-sm text-base-content/70">Your payment was not completed. You can try again.</p>
            </>
          )}

          {status === 'pending' && (
            <>
              <FaClock className="text-6xl text-warning" />
              <h2 className="card-title mt-2">Still Processing</h2>
              <p className="text-sm text-base-content/70">
                We haven't received confirmation yet. Check your dashboard in a few minutes.
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <FaTimesCircle className="text-6xl text-error" />
              <h2 className="card-title mt-2">Something went wrong</h2>
              <p className="text-sm text-base-content/70">We couldn't find this payment.</p>
            </>
          )}

          {status !== 'checking' && (
            <Link to="/dashboard" className="btn btn-primary mt-4">
              Back to Dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;