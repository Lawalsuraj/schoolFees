import { useState, forwardRef } from 'react';
import { createStudent } from '../api/student.api.js';

const AddStudentModal = forwardRef(({ onStudentCreated }, ref) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [className, setClassName] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const closeModal = () => ref.current.close();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      await createStudent({ name, email, password, className });
      setName('');
      setEmail('');
      setPassword('');
      setClassName('');
      closeModal();
      onStudentCreated(); // tell the parent to refresh its list
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create student');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Add New Student</h3>

        {formError && <div className="alert alert-error text-sm mb-2">{formError}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Full Name"
            className="input input-bordered w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Class (e.g. JSS1)"
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
              {submitting ? 'Adding...' : 'Add Student'}
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

export default AddStudentModal;