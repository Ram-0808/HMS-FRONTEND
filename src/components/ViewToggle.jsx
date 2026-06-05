import { LayoutList, LayoutGrid } from 'lucide-react';

export default function ViewToggle({ view, onChange }) {
  return (
    <div className="flex items-center bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => onChange('list')}
        className={`p-2 rounded-md transition-all ${
          view === 'list'
            ? 'bg-white shadow-sm text-primary-600'
            : 'text-gray-400 hover:text-gray-600'
        }`}
        title="List view"
      >
        <LayoutList className="w-4 h-4" />
      </button>
      <button
        onClick={() => onChange('grid')}
        className={`p-2 rounded-md transition-all ${
          view === 'grid'
            ? 'bg-white shadow-sm text-primary-600'
            : 'text-gray-400 hover:text-gray-600'
        }`}
        title="Grid view"
      >
        <LayoutGrid className="w-4 h-4" />
      </button>
    </div>
  );
}
