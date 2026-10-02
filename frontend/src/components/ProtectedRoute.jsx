import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" />; // logged in, but wrong role
  }

  return children;
};

export default ProtectedRoute;