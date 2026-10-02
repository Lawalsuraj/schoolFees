import { useState, useEffect } from 'react';
import Logo from '../components/Logo.jsx';
import useAuthStore from '../store/authStore.js';
import { getMyFeeRecords } from '../api/feeRecord.api.js';
import { initiatePayment } from '../api/payment.api.js';

const statusBadge = {
  paid: 'badge-success',
  partial: 'badge-warning',
  unpaid: 'badge-error',
};

const StudentDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [feeRecords, setFeeRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null); // tracks which record is currently being paid

  const fetchFeeRecords = async () => {
    try {
      const res = await getMyFeeRecords();
      setFeeRecords(res.data.data.feeRecords);
    } catch (err) {
      console.error('Failed to fetch fee records', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeRecords();
  }, []);

  const handlePay = async (feeRecordId) => {
    setPayingId(feeRecordId);
    try {
      const res = await initiatePayment(feeRecordId);
      window.location.href = res.data.data.authorizationUrl; // redirect to Paystack checkout
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to start payment');
      setPayingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="navbar bg-base-100 rounded-box shadow mb-6">
        <div className="flex-1">
          <Logo size="text-xl" />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm">Welcome, {user?.name}</span>
          <button className="btn btn-outline btn-sm" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <div className="card bg-base-100 shadow p-4">
        <h2 className="text-lg font-semibold mb-4">My Fee Records</h2>

        {loading ? (
          <span className="loading loading-spinner"></span>
        ) : feeRecords.length === 0 ? (
          <p className="text-sm text-gray-500">No fee records yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Session</th>
                  <th>Term</th>
                  <th>Due</th>
                  <th>Paid</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {feeRecords.map((record) => (
                  <tr key={record._id}>
                    <td>{record.session}</td>
                    <td>{record.term}</td>
                    <td>₦{record.amountDue.toLocaleString()}</td>
                    <td>₦{record.amountPaid.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${statusBadge[record.status]}`}>{record.status}</span>
                    </td>
                    <td>
                      {record.status !== 'paid' && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handlePay(record._id)}
                          disabled={payingId === record._id}
                        >
                          {payingId === record._id ? 'Redirecting...' : 'Pay Now'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;