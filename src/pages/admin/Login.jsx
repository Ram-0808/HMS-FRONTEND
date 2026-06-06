import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

// Floating medical SVG icons
const MedicalIcons = {
  heartPulse: (
    <path d="M19.5 12.572l-7.5 7.428l-7.5-7.428a5 5 0 1 1 7.5-6.566a5 5 0 1 1 7.5 6.572M3 12h4l2-4l3 8l2-4h4" />
  ),
  stethoscope: (
    <>
      <path d="M6 2v6a6 6 0 0 0 12 0V2" />
      <path d="M4 2h4M16 2h4" />
      <circle cx="18" cy="16" r="2" />
      <path d="M18 18v.5a2.5 2.5 0 0 1-5 0v-2" />
    </>
  ),
  pill: (
    <>
      <path d="M10.5 1.5l-8.4 8.4a4.95 4.95 0 0 0 7 7l8.4-8.4a4.95 4.95 0 0 0-7-7z" />
      <path d="M6.3 11.7l5.4-5.4" />
    </>
  ),
  cross: (
    <>
      <rect x="9" y="2" width="6" height="20" rx="1.5" />
      <rect x="2" y="9" width="20" height="6" rx="1.5" />
    </>
  ),
  dna: (
    <>
      <path d="M2 15c6.667-6 13.333 0 20-6" />
      <path d="M9 22c1.8-2 2.5-4 2.8-6" />
      <path d="M15 2c-1.8 2-2.5 4-2.8 6" />
      <path d="M2 9c6.667 6 13.333 0 20 6" />
    </>
  ),
  shield: (
    <>
      <path d="M12 2l8 4v6c0 5.25-3.5 8.75-8 10c-4.5-1.25-8-4.75-8-10V6l8-4z" />
      <path d="M9 12l2 2l4-4" />
    </>
  ),
  syringe: (
    <>
      <path d="M18 2l4 4M15 5l6 6M11 9l-1 1 6 6 1-1" />
      <path d="M10 10L3.5 16.5a2.12 2.12 0 0 0 3 3L13 13" />
      <path d="M9 13l-2 2M13 9l-2 2" />
      <path d="M2 22l2-2" />
    </>
  ),
  thermometer: (
    <>
      <path d="M14.5 4.5a2.5 2.5 0 0 0-5 0v10.59a4 4 0 1 0 5 0V4.5z" />
      <circle cx="12" cy="17" r="1.5" />
      <path d="M12 9v5" />
    </>
  ),
  lungs: (
    <>
      <path d="M12 2v8" />
      <path d="M6.8 10C5 10 3 11.5 3 14c0 3 2 5 5 5h1" />
      <path d="M17.2 10C19 10 21 11.5 21 14c0 3-2 5-5 5h-1" />
      <path d="M9 19v-3a3 3 0 0 1 3-3h0a3 3 0 0 1 3 3v3" />
    </>
  ),
  bandage: (
    <>
      <path d="M7.5 2.5L2.5 7.5a3.54 3.54 0 0 0 5 5l5-5a3.54 3.54 0 0 0-5-5z" />
      <path d="M16.5 21.5l5-5a3.54 3.54 0 0 0-5-5l-5 5a3.54 3.54 0 0 0 5 5z" />
      <path d="M10 10l4 4" />
      <circle cx="11" cy="11" r="0.5" fill="currentColor" />
      <circle cx="13" cy="13" r="0.5" fill="currentColor" />
    </>
  ),
  microscope: (
    <>
      <path d="M6 18h8" />
      <path d="M3 22h18" />
      <path d="M14 22a7 7 0 1 0-4-12.9" />
      <path d="M10 6V2" />
      <path d="M10 6l5 5" />
      <circle cx="10" cy="10" r="2" />
    </>
  ),
  ecg: (
    <path d="M2 12h3l2-3l3 6l2-3h3l2 3l2-6l2 3h3" />
  ),
};

// Icon positions — spread evenly across the screen
const ICON_PLACEMENTS = [
  { icon: 'heartPulse', top: '6%', left: '6%', size: 40, opacity: 0.25, delay: 0, dur: 7 },
  { icon: 'stethoscope', top: '10%', right: '10%', size: 48, opacity: 0.18, delay: 1.2, dur: 8 },
  { icon: 'pill', top: '50%', left: '4%', size: 32, opacity: 0.22, delay: 2, dur: 6 },
  { icon: 'cross', bottom: '18%', right: '6%', size: 36, opacity: 0.2, delay: 0.5, dur: 7.5 },
  { icon: 'dna', top: '32%', left: '12%', size: 28, opacity: 0.2, delay: 3, dur: 9 },
  { icon: 'shield', bottom: '32%', left: '8%', size: 34, opacity: 0.18, delay: 1.5, dur: 7 },
  { icon: 'heartPulse', bottom: '10%', right: '12%', size: 28, opacity: 0.22, delay: 2.5, dur: 6.5 },
  { icon: 'pill', top: '20%', right: '4%', size: 24, opacity: 0.18, delay: 4, dur: 7 },
  { icon: 'cross', top: '72%', right: '18%', size: 42, opacity: 0.15, delay: 1.2, dur: 8.5 },
  { icon: 'stethoscope', bottom: '6%', left: '18%', size: 36, opacity: 0.2, delay: 3.5, dur: 6 },
  { icon: 'syringe', top: '42%', right: '8%', size: 30, opacity: 0.2, delay: 2.2, dur: 7 },
  { icon: 'thermometer', bottom: '45%', right: '4%', size: 26, opacity: 0.18, delay: 0.8, dur: 8 },
  { icon: 'lungs', top: '80%', left: '6%', size: 38, opacity: 0.15, delay: 1.8, dur: 7.5 },
  { icon: 'bandage', top: '5%', left: '35%', size: 22, opacity: 0.15, delay: 4.5, dur: 9 },
  { icon: 'microscope', bottom: '5%', right: '35%', size: 26, opacity: 0.15, delay: 3.2, dur: 8 },
  { icon: 'ecg', top: '88%', left: '40%', size: 50, opacity: 0.12, delay: 0, dur: 6 },
  { icon: 'ecg', top: '3%', right: '30%', size: 44, opacity: 0.1, delay: 2, dur: 7 },
  { icon: 'heartPulse', top: '60%', left: '18%', size: 20, opacity: 0.18, delay: 5, dur: 6.5 },
];

function FloatingIcon({ icon, size, opacity, delay, dur, ...pos }) {
  const style = {
    ...pos,
    width: size,
    height: size,
    animationDelay: `${delay}s`,
    animationDuration: `${dur}s`,
  };

  return (
    <svg
      className="absolute animate-float-medical"
      style={style}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={opacity}
      color="white"
    >
      {MedicalIcons[icon]}
    </svg>
  );
}

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Invalid credentials. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 flex items-center justify-center px-4 relative overflow-hidden">

      {/* Layered gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-primary-400/8 rounded-full blur-[100px]" />
        <div className="absolute -bottom-48 -left-48 w-[600px] h-[600px] bg-accent-400/6 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary-300/5 rounded-full blur-[80px]" />
        <div className="absolute top-[20%] right-[20%] w-48 h-48 bg-teal-300/8 rounded-full blur-[60px]" />
      </div>

      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Floating medical icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {ICON_PLACEMENTS.map((placement, i) => (
          <FloatingIcon key={i} {...placement} />
        ))}
      </div>

      {/* Main content */}
      <div className="w-full max-w-[420px] relative z-10">
        {/* Logo */}
        <div className="text-center mb-9">
          <div className="inline-block p-2 rounded-full bg-white/10 backdrop-blur-sm mb-5 ring-1 ring-white/20 shadow-xl shadow-black/10">
            <img
              src="/logo.png"
              alt="Swarna Hospitals"
              className="w-16 h-16 rounded-full object-cover"
            />
          </div>
          <h1 className="font-heading text-3xl font-bold text-white tracking-tight drop-shadow-sm">
            Swarna Hospitals
          </h1>
          <p className="text-sm text-primary-200/70 mt-2.5 font-medium">
            Admin Portal — Sign in to continue
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/[0.97] backdrop-blur-2xl rounded-[28px] shadow-2xl shadow-black/25 border border-white/40 p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl border border-red-100 animate-fade-in-up">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                placeholder="Enter your username"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm bg-gray-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm bg-gray-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all pr-11 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:from-primary-400 disabled:to-primary-400 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-primary-600/20 hover:shadow-xl hover:shadow-primary-600/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Divider + hint */}
          <div className="mt-7 pt-5 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              🔒 Secure access for authorized hospital staff
            </p>
          </div>
        </div>
      </div>

      {/* CSS for floating animation */}
      <style>{`
        .animate-float-medical {
          animation: floatMed 7s ease-in-out infinite;
        }
        @keyframes floatMed {
          0%, 100% {
            transform: translateY(0) rotate(0deg) scale(1);
          }
          25% {
            transform: translateY(-8px) rotate(2deg) scale(1.02);
          }
          50% {
            transform: translateY(-14px) rotate(-1deg) scale(0.98);
          }
          75% {
            transform: translateY(-6px) rotate(1.5deg) scale(1.01);
          }
        }
      `}</style>
    </div>
  );
}
