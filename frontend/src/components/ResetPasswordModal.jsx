import { useState, forwardRef } from 'react';
import { resetStudentPassword } from '../api/student.api.js';

const ResetPasswordModal = forwardRef(({ student, onReset }, ref) => {
  const [newPassword, setNewPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const closeModal = () => ref.current.close();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      await resetStudentPassword(student._id, newPassword);
      setNewPassword('');
      closeModal();
      onReset();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Reset Password for {student?.name}</h3>

        {formError && <div className="alert alert-error text-sm mb-2">{formError}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            placeholder="New Password"
            className="input input-bordered w-full"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
          />

          <div className="modal-action">
            <button type="button" className="btn" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Resetting...' : 'Reset Password'}
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

export default ResetPasswordModal;