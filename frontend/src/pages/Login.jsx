import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';
import Logo from '../components/Logo.jsx';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
       e.preventDefault();
       setError('');
        setLoading(true);

      try {
        await login(email, password);
        const role = useAuthStore.getState().user.role;
        navigate(role === 'admin' ? '/admin' : '/dashboard');
      } catch (err) {
        setError(err.response?.data?.message || 'Login failed');
      } finally {
        setLoading(false);
    }
  } ;

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">

          {/* logo */}
          <div className="flex justify-center mb-2">
              <Logo size="text-3xl" />
          </div>

          <h2 className="card-title justify-center mb-4">Login</h2>

          {error && <div className="alert alert-error text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;