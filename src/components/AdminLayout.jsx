import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Stethoscope,
  Settings,
  ImageIcon,
  LogOut,
} from 'lucide-react';

const SIDEBAR_LINKS = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/patients', icon: Users, label: 'Patients' },
  { to: '/admin/patients/new', icon: UserPlus, label: 'Add Patient' },
  { to: '/admin/doctors', icon: Stethoscope, label: 'Doctors' },
  { to: '/admin/gallery', icon: ImageIcon, label: 'Gallery' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 bg-primary-900 flex-col fixed inset-y-0">
        {/* Logo */}
        <div className="h-18 flex items-center gap-2.5 px-5 border-b border-primary-800">
          <img
            src="/logo.png"
            alt="Swarna Hospitals"
            className="w-9 h-9 rounded-full object-cover bg-white/20 p-0.5"
          />
          <div className="leading-tight">
            <span className="font-heading text-lg font-semibold text-white block">Swarna</span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-primary-400 font-medium">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {SIDEBAR_LINKS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary-800 text-white'
                    : 'text-primary-200 hover:bg-primary-800/50 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-primary-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-primary-300 hover:bg-primary-800 hover:text-white transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 md:ml-60">
        {/* Top header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
          {/* Mobile menu — simple logo + logout */}
          <div className="md:hidden flex items-center gap-2">
            <img src="/logo.png" alt="" className="w-7 h-7 rounded-full object-cover" />
            <span className="font-heading text-lg font-semibold text-primary-900">Swarna</span>
          </div>
          <div className="hidden md:block text-sm text-gray-500">Welcome, Admin</div>
          <button
            onClick={handleLogout}
            className="md:hidden flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>

          {/* Mobile nav pills */}
        </header>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-50 flex">
          {SIDEBAR_LINKS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center py-2 text-[10px] font-medium transition ${
                  isActive ? 'text-primary-600' : 'text-gray-400'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Page content */}
        <div className="p-6 pb-24 md:pb-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
