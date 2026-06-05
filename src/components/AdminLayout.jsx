import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Settings,
  ImageIcon,
  LogOut,
  Pill,
  ChevronDown,
  ChevronRight,
  ShoppingCart,
  Package,
  Truck,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/patients', icon: Users, label: 'Patients' },
  { to: '/admin/doctors', icon: Stethoscope, label: 'Doctors' },
];

const PHARMACY_ITEMS = [
  { to: '/admin/pharmacy/vendors', icon: Truck, label: 'Vendors' },
  { to: '/admin/pharmacy/medicines', icon: Pill, label: 'Medicines' },
  { to: '/admin/pharmacy/batches', icon: Package, label: 'Stock / Purchases' },
  { to: '/admin/pharmacy/sales', icon: ShoppingCart, label: 'Record Sale' },
];

const BOTTOM_ITEMS = [
  { to: '/admin/gallery', icon: ImageIcon, label: 'Gallery' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [pharmacyOpen, setPharmacyOpen] = useState(() =>
    window.location.pathname.startsWith('/admin/pharmacy')
  );

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 bg-primary-900 flex-col fixed inset-y-0">
        {/* Logo */}
        <div className="h-18 flex items-center gap-2.5 px-5 border-b border-primary-800 shrink-0">
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

        {/* Nav — space-between: top items at top, bottom items at bottom */}
        <nav className="flex-1 flex flex-col justify-between px-3 py-4">
          {/* Top section */}
          <div className="flex flex-col gap-0.5">
            {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end
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

            {/* Pharmacy collapsible */}
            <button
              onClick={() => setPharmacyOpen((v) => !v)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                pharmacyOpen
                  ? 'bg-primary-800 text-white'
                  : 'text-primary-200 hover:bg-primary-800/50 hover:text-white'
              }`}
            >
              <Pill className="w-5 h-5" />
              <span className="flex-1 text-left">Pharmacy</span>
              {pharmacyOpen ? (
                <ChevronDown className="w-4 h-4 shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 shrink-0" />
              )}
            </button>

            {pharmacyOpen && (
              <div className="flex flex-col gap-0.5 pl-3">
                {PHARMACY_ITEMS.map(({ to, icon: Icon, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 pl-4 pr-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-primary-700 text-white'
                          : 'text-primary-300 hover:bg-primary-800/50 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* Bottom section */}
          <div className="flex flex-col gap-0.5 mt-4">
            {BOTTOM_ITEMS.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end
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
          </div>
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-primary-800 shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-primary-300 hover:bg-primary-800 hover:text-white transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 md:ml-60">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
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
        </header>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-50 flex">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end
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
          {PHARMACY_ITEMS.map(({ to, icon: Icon, label }) => (
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

        <div className="p-6 pb-24 md:pb-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
