import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';
import Logo from '../components/Logo.jsx';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [className, setClassName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(name, email, password, className);
      navigate('/dashboard'); // public register is always role: student
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex justify-center mb-2">
            <Logo size="text-3xl" />
          </div>
          <h2 className="card-title justify-center mb-4">Register</h2>

          {error && <div className="alert alert-error text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <p className="text-center text-sm mt-2">
            Already have an account? <Link to="/login" className="link link-primary">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;