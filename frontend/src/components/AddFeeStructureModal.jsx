import { useState, forwardRef } from 'react';
import { createFeeStructure } from '../api/feeStructure.api.js';

const AddFeeStructureModal = forwardRef(({ onCreated }, ref) => {
  const [className, setClassName] = useState('');
  const [session, setSession] = useState('');
  const [term, setTerm] = useState('1st');
  const [amount, setAmount] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const closeModal = () => ref.current.close();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      await createFeeStructure({ className, session, term, amount: Number(amount) });
      setClassName('');
      setSession('');
      setTerm('1st');
      setAmount('');
      closeModal();
      onCreated();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create fee structure');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Add Fee Structure</h3>

        {formError && <div className="alert alert-error text-sm mb-2">{formError}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Class (e.g. JSS1)"
            className="input input-bordered w-full"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Session (e.g. 2026/2027)"
            className="input input-bordered w-full"
            value={session}
            onChange={(e) => setSession(e.target.value)}
            required
          />
          <select
            className="select select-bordered w-full"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          >
            <option value="1st">1st Term</option>
            <option value="2nd">2nd Term</option>
            <option value="3rd">3rd Term</option>
          </select>
          <input
            type="number"
            placeholder="Amount (₦)"
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
              {submitting ? 'Adding...' : 'Add Fee Structure'}
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

export default AddFeeStructureModal;