import { Outlet, Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaUserGraduate, FaMoneyBillWave, FaFileInvoiceDollar } from 'react-icons/fa';
import Logo from '../components/Logo.jsx';
import useAuthStore from '../store/authStore.js';

const navItems = [
  { path: '/admin', label: 'Overview', icon: <FaTachometerAlt /> },
  { path: '/admin/students', label: 'Students', icon: <FaUserGraduate /> },
  { path: '/admin/fee-structures', label: 'Fee Structures', icon: <FaMoneyBillWave /> },
  { path: '/admin/fee-records', label: 'Fee Records', icon: <FaFileInvoiceDollar /> },
];

const AdminLayout = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-base-200">
      {/* Sidebar */}
      <aside className="w-64 bg-base-100 shadow-lg flex flex-col">
        <div className="p-4 border-b border-base-300">
          <Logo size="text-lg" />
        </div>

        <nav className="flex-1 p-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg mb-1 ${
                location.pathname === item.path ? 'bg-primary text-primary-content' : 'hover:bg-base-200'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-base-300">
          <p className="text-sm mb-2">Signed in as {user?.name}</p>
          <button className="btn btn-outline btn-sm w-full" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;