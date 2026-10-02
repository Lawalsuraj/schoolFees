import { useState, forwardRef, useEffect } from 'react';
import { updateStudent } from '../api/student.api.js';

const EditStudentModal = forwardRef(({ student, onUpdated }, ref) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [className, setClassName] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Pre-fill form whenever a different student is selected for editing
  useEffect(() => {
    if (student) {
      setName(student.name);
      setEmail(student.email);
      setClassName(student.className);
    }
  }, [student]);

  const closeModal = () => ref.current.close();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      await updateStudent(student._id, { name, email, className });
      closeModal();
      onUpdated();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update student');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Edit Student</h3>

        {formError && <div className="alert alert-error text-sm mb-2">{formError}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            className="input input-bordered w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            className="input input-bordered w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            className="input input-bordered w-full"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
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

export default EditStudentModal;