const GRADIENTS = {
  primary: 'from-primary-600 to-primary-700',
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  amber: 'from-amber-500 to-amber-600',
  red: 'from-red-500 to-red-600',
};

const ICON_BG = {
  primary: 'bg-primary-100 text-primary-600',
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  amber: 'bg-amber-100 text-amber-600',
  red: 'bg-red-100 text-red-600',
};

export default function StatCard({ icon: Icon, value, label, color = 'primary' }) {
  return (
    <div className="relative bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 overflow-hidden group hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300">
      {/* Subtle gradient background accent */}
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br ${GRADIENTS[color]} opacity-5 -translate-y-6 translate-x-6 group-hover:opacity-10 transition-opacity`} />
      
      <div className={`relative w-12 h-12 rounded-2xl bg-gradient-to-br ${GRADIENTS[color]} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="min-w-0 relative">
        <p className="text-2xl font-bold text-gray-900 leading-none truncate">{value}</p>
        <p className="text-xs text-gray-500 mt-1.5 font-medium">{label}</p>
      </div>
    </div>
  );
}
