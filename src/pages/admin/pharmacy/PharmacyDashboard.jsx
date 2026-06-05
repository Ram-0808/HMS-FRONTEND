import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Pill, AlertTriangle, Clock, XCircle, ShoppingCart, IndianRupee, Package, Plus } from 'lucide-react';
import StatCard from '../../../components/StatCard';
import API from '../../../services/api';

export default function PharmacyDashboard() {
  const [stats, setStats] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, lowStockRes, salesRes] = await Promise.all([
          API.get('/pharmacy/dashboard/stats/'),
          API.get('/pharmacy/medicines/?stock=low'),
          API.get('/pharmacy/sales/?page_size=5'),
        ]);
        setStats(statsRes.data);
        setLowStock(lowStockRes.data.results || lowStockRes.data);
        setRecentSales(salesRes.data.results || salesRes.data);
      } catch {
        setError('Failed to load pharmacy dashboard data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500">{error}</div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-gray-900">Pharmacy Dashboard</h1>
        <Link
          to="/admin/pharmacy/medicines/new"
          className="flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Medicine
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Pill}
          value={stats?.total_medicines ?? 0}
          label="Total Medicines"
          color="primary"
        />
        <StatCard
          icon={AlertTriangle}
          value={stats?.low_stock ?? 0}
          label="Low Stock"
          color="amber"
        />
        <StatCard
          icon={Clock}
          value={stats?.expiring_soon ?? 0}
          label="Expiring Soon"
          color="amber"
        />
        <StatCard
          icon={XCircle}
          value={stats?.out_of_stock ?? 0}
          label="Out of Stock"
          color="primary"
        />
        <StatCard
          icon={ShoppingCart}
          value={stats?.today_sales ?? 0}
          label="Today's Sales"
          color="blue"
        />
        <StatCard
          icon={IndianRupee}
          value={`₹${Number(stats?.today_revenue ?? 0).toLocaleString('en-IN')}`}
          label="Today's Revenue"
          color="green"
        />
        <StatCard
          icon={Package}
          value={`₹${Number(stats?.total_stock_value ?? 0).toLocaleString('en-IN')}`}
          label="Total Stock Value"
          color="primary"
        />
      </div>

      {/* Low Stock Alerts */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Low Stock Alerts</h2>
          <Link
            to="/admin/pharmacy/medicines"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View All Medicines
          </Link>
        </div>

        {lowStock.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No low stock alerts.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-primary-50 text-left">
                  <th className="px-5 py-3 font-semibold text-primary-800">Medicine Name</th>
                  <th className="px-5 py-3 font-semibold text-primary-800">Stock</th>
                  <th className="px-5 py-3 font-semibold text-primary-800">Reorder Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {lowStock.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-900">{m.name}</td>
                    <td className="px-5 py-3">
                      <span className="inline-block px-2.5 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                        {m.stock_quantity}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{m.reorder_level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Sales */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Recent Sales</h2>
          <Link
            to="/admin/pharmacy/sales"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View All Sales
          </Link>
        </div>

        {recentSales.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No sales recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-primary-50 text-left">
                  <th className="px-5 py-3 font-semibold text-primary-800">Invoice #</th>
                  <th className="px-5 py-3 font-semibold text-primary-800">Customer</th>
                  <th className="px-5 py-3 font-semibold text-primary-800">Items</th>
                  <th className="px-5 py-3 font-semibold text-primary-800">Total</th>
                  <th className="px-5 py-3 font-semibold text-primary-800">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentSales.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-900">{s.invoice_number || s.id}</td>
                    <td className="px-5 py-3 text-gray-600">{s.customer_name || '—'}</td>
                    <td className="px-5 py-3 text-gray-600">{s.items_count || s.items?.length || 0}</td>
                    <td className="px-5 py-3 text-gray-600">
                      ₹{Number(s.total_amount ?? 0).toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-3 text-gray-400">
                      {new Date(s.created_at).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
