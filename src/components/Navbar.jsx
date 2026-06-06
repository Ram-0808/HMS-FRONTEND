import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import useSiteSettings from '../utils/useSiteSettings';

const NAV_LINKS = [
  { to: '/about', label: 'About Us' },
  { to: '/who-we-are', label: 'Who We Are' },
  { to: '/services', label: 'Services' },
  { to: '/vision-mission', label: 'Vision & Mission' },
  { to: '/contact', label: 'Contact Us' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const { settings } = useSiteSettings();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top bar with contact info */}
      <div className="hidden md:block bg-primary-900 text-primary-100 text-xs py-1.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <span>{settings.working_hours || 'Mon–Sat: 8 AM – 9 PM'}</span>
          <div className="flex items-center gap-4">
            {settings.phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="w-3 h-3" />
                {settings.phone}
              </span>
            )}
            {settings.emergency_phone && (
              <span className="text-accent-300 font-semibold">
                Emergency: {settings.emergency_phone}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-gray-200/50 border-b border-gray-100'
          : 'bg-white border-b border-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-[68px]">

            {/* Logo */}
            <Link to="/about" className="flex items-center gap-3 group">
              <div className="relative">
                <img
                  src="/logo.png"
                  alt="Swarna Hospitals"
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-primary-100 group-hover:ring-primary-300 transition-all"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
              </div>
              <div className="leading-tight">
                <span className="font-heading text-xl font-bold text-primary-900 block tracking-tight">
                  Swarna
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-primary-600 font-semibold">
                  Hospitals
                </span>
              </div>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-0.5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname === link.to
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-gray-600 hover:text-primary-700 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                  {pathname === link.to && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-primary-500 rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* CTA + Mobile menu */}
            <div className="flex items-center gap-3">
              <Link
                to="/contact"
                className="hidden lg:flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-primary-600/20 hover:shadow-lg hover:shadow-primary-600/30 hover:-translate-y-0.5"
              >
                <Phone className="w-3.5 h-3.5" />
                Book Appointment
              </Link>

              <button
                onClick={() => setOpen(!open)}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                aria-label="Toggle menu"
              >
                {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="md:hidden border-t border-gray-100 bg-white/98 backdrop-blur-md animate-fade-in-up">
            <div className="px-4 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition ${
                    pathname === link.to
                      ? 'bg-primary-50 text-primary-700 border-l-3 border-primary-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-primary-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
