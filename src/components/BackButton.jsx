import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * Consistent back button for all form pages.
 * Shows a styled arrow button with an optional label.
 */
export default function BackButton({ label, to, className = '' }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) navigate(to);
    else navigate(-1);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-all shadow-sm ${className}`}
    >
      <ArrowLeft className="w-4 h-4" />
      {label && <span>{label}</span>}
    </button>
  );
}
