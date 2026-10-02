import { useState, useEffect } from 'react';
import { getAllFeeRecords, generateFeeRecords , deleteFeeRecord } from '../../api/feeRecord.api.js';

import {getAllFeeStructures} from '../../api/feeStructure.api.js';

const statusBadge = {
  paid: 'badge-success',
  partial: 'badge-warning',
  unpaid: 'badge-error',
};

const AdminFeeRecords = () => {
  const [feeRecords, setFeeRecords] = useState([]);
  const [feeStructures, setFeeStructures] = useState([]);
  const [selectedStructure, setSelectedStructure] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState('');

  const fetchFeeRecords = async () => {
    try {
      const res = await getAllFeeRecords();
      setFeeRecords(res.data.data.feeRecords);
    } catch (err) {
      console.error('Failed to fetch fee records', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeeStructures = async () => {
    try {
      const res = await getAllFeeStructures();
      setFeeStructures(res.data.data.feeStructures);
    } catch (err) {
      console.error('Failed to fetch fee structures', err);
    }
  };



  const handleDelete = async (id) => {
  if (!confirm('Delete this fee record?')) return;
  try {
    await deleteFeeRecord(id);
    fetchFeeRecords();
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to delete fee record');
  }
};

  useEffect(() => {
    fetchFeeRecords();
    fetchFeeStructures();
  }, []);

  const handleGenerate = async () => {
    if (!selectedStructure) return;
    setGenerating(true);
    setMessage('');

    try {
      const res = await generateFeeRecords(selectedStructure);
      setMessage(`Generated ${res.data.results} fee record(s).`);
      fetchFeeRecords();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to generate fee records');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Fee Records</h2>

      <div className="flex gap-2 items-center mb-4">
        <select
          className="select select-bordered"
          value={selectedStructure}
          onChange={(e) => setSelectedStructure(e.target.value)}
        >
          <option value="">Select a fee structure</option>
          {feeStructures.map((fs) => (
            <option key={fs._id} value={fs._id}>
              {fs.className} — {fs.session} — {fs.term} Term
            </option>
          ))}
        </select>
        <button
          className="btn btn-primary"
          onClick={handleGenerate}
          disabled={!selectedStructure || generating}
        >
          {generating ? 'Generating...' : 'Generate Records'}
        </button>
      </div>

      {message && <div className="alert alert-info text-sm mb-4">{message}</div>}

      {loading ? (
        <span className="loading loading-spinner"></span>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Class</th>
                <th>Session</th>
                <th>Term</th>
                <th>Due</th>
                <th>Paid</th>
                <th>Status</th>
              </tr>
            </thead>
          <thead>
              <tr>
                <th>Student</th>
                <th>Class</th>
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
                  <td>{record.student?.name}</td>
                  <td>{record.student?.className}</td>
                  <td>{record.session}</td>
                  <td>{record.term}</td>
                  <td>₦{record.amountDue.toLocaleString()}</td>
                  <td>₦{record.amountPaid.toLocaleString()}</td>
                  <td>
                    <span className={`badge ${statusBadge[record.status]}`}>{record.status}</span>
                  </td>
                  <td>
                    <button className="btn btn-xs btn-error" onClick={() => handleDelete(record._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminFeeRecords;