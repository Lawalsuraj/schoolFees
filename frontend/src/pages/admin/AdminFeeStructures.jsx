import { useState, useEffect, useRef } from 'react';
import { getAllFeeStructures, deleteFeeStructure } from '../../api/feeStructure.api.js';
import AddFeeStructureModal from '../../components/AddFeeStructureModal.jsx';
import EditFeeStructureModal from '../../components/EditFeeStructureModal.jsx';

const AdminFeeStructures = () => {
  const [feeStructures, setFeeStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStructure, setSelectedStructure] = useState(null);

  const addModalRef = useRef(null);
  const editModalRef = useRef(null);

  const fetchFeeStructures = async () => {
    try {
      const res = await getAllFeeStructures();
      setFeeStructures(res.data.data.feeStructures);
    } catch (err) {
      console.error('Failed to fetch fee structures', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeStructures();
  }, []);

  const openEditModal = (fs) => {
    setSelectedStructure(fs);
    editModalRef.current.showModal();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this fee structure?')) return;
    try {
      await deleteFeeStructure(id);
      fetchFeeStructures();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete fee structure');
    }
  };

  return (
    <div className="card bg-base-100 shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Fee Structures</h2>
        <button className="btn btn-primary btn-sm" onClick={() => addModalRef.current.showModal()}>
          + Add Fee Structure
        </button>
      </div>

      {loading ? (
        <span className="loading loading-spinner"></span>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Class</th>
                <th>Session</th>
                <th>Term</th>
                <th>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {feeStructures.map((fs) => (
                <tr key={fs._id}>
                  <td>{fs.className}</td>
                  <td>{fs.session}</td>
                  <td>{fs.term}</td>
                  <td>₦{fs.amount.toLocaleString()}</td>
                  <td className="flex gap-2">
                    <button className="btn btn-xs btn-outline" onClick={() => openEditModal(fs)}>
                      Edit
                    </button>
                    <button className="btn btn-xs btn-error" onClick={() => handleDelete(fs._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AddFeeStructureModal ref={addModalRef} onCreated={fetchFeeStructures} />
      <EditFeeStructureModal ref={editModalRef} feeStructure={selectedStructure} onUpdated={fetchFeeStructures} />
    </div>
  );
};

export default AdminFeeStructures;