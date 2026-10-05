import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from './store/authStore.js';
import Login from './pages/Login.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';
import Register from './pages/Register.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import AdminOverview from './pages/admin/AdminOverview.jsx';
import AdminStudents from './pages/admin/AdminStudents.jsx';
import AdminFeeStructures from './pages/admin/AdminFeeStructures.jsx';
import AdminFeeRecords from './pages/admin/AdminFeeRecords.jsx';
import Landing from './pages/Landing.jsx';

function App() {

  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="fee-structures" element={<AdminFeeStructures />} />
        <Route path="fee-records" element={<AdminFeeRecords />} />
      </Route>

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  </BrowserRouter>

  )}

export default App;