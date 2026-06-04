import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import useSiteSettings from '../utils/useSiteSettings';

export default function Footer() {
  const { settings } = useSiteSettings();

  return (
    <footer className="bg-primary-900 text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Column 1: Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <img
                src="/logo.png"
                alt="Swarna Hospitals"
                className="w-11 h-11 rounded-full object-cover bg-white/20 p-0.5"
              />
              <div className="leading-tight">
                <span className="font-heading text-xl font-semibold block">Swarna</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-primary-300 font-medium">
                  Hospitals
                </span>
              </div>
            </div>
            <p className="text-primary-200 text-sm leading-relaxed max-w-xs">
              {settings.hero_tagline}. Providing quality healthcare with compassion
              and dedication to our community for over a decade.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-primary-300 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {[
                { to: '/about', label: 'About Us' },
                { to: '/who-we-are', label: 'Our Doctors' },
                { to: '/services', label: 'Services' },
                { to: '/vision-mission', label: 'Vision & Mission' },
                { to: '/contact', label: 'Contact Us' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-primary-100 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-primary-300 mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3">
              {settings.address && (
                <li className="flex items-start gap-3 text-sm text-primary-100">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary-400" />
                  <span>{settings.address}</span>
                </li>
              )}
              {settings.phone && (
                <li className="flex items-center gap-3 text-sm text-primary-100">
                  <Phone className="w-4 h-4 shrink-0 text-primary-400" />
                  <span>{settings.phone}</span>
                </li>
              )}
              {settings.email && (
                <li className="flex items-center gap-3 text-sm text-primary-100">
                  <Mail className="w-4 h-4 shrink-0 text-primary-400" />
                  <span>{settings.email}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-xs text-primary-400">
          © {new Date().getFullYear()} {settings.hospital_name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
