import { useState, forwardRef, useEffect } from 'react';
import { updateFeeStructure } from '../api/feeStructure.api.js';

const EditFeeStructureModal = forwardRef(({ feeStructure, onUpdated }, ref) => {
  const [amount, setAmount] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (feeStructure) setAmount(feeStructure.amount);
  }, [feeStructure]);

  const closeModal = () => ref.current.close();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      await updateFeeStructure(feeStructure._id, Number(amount));
      closeModal();
      onUpdated();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update fee structure');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">
          Edit Amount — {feeStructure?.className} ({feeStructure?.session}, {feeStructure?.term} Term)
        </h3>

        {formError && <div className="alert alert-error text-sm mb-2">{formError}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="number"
            className="input input-bordered w-full"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <div className="modal-action">
            <button type="button" className="btn" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});

export default EditFeeStructureModal;