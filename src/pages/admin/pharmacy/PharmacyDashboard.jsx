import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Pill, AlertTriangle, Clock, ShoppingCart, Package,
  Plus, Truck, ArrowRight, TrendingUp,
} from 'lucide-react';
import API from '../../../services/api';

export default function PharmacyDashboard() {
  const [stats, setStats] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, lowStockRes, salesRes] = await Promise.all([
          API.get('/pharmacy/dashboard/stats/'),
          API.get('/pharmacy/medicines/?stock=low'),
          API.get('/pharmacy/sales/'),
        ]);
        setStats(statsRes.data);
        setLowStock(lowStockRes.data.results || lowStockRes.data);
        setSales(salesRes.data.results || salesRes.data);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const sales = recentSales.slice(0, 5);
  const todaySales = stats?.today_sales_count ?? 0;
  const todayRevenue = Number(stats?.today_sales_revenue ?? 0);
  const lowStockCount = stats?.low_stock_count ?? 0;
  const expiringCount = stats?.expiring_soon_count ?? 0;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Pharmacy</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage stock, sales & vendors</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/pharmacy/vendors" className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
            <Truck className="w-4 h-4" />
            Vendors
          </Link>
          <Link to="/admin/pharmacy/medicines" className="flex items-center gap-1.5 bg-primary-50 hover:bg-primary-100 text-primary-700 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
            <Pill className="w-4 h-4" />
            Medicines
          </Link>
        </div>
      </div>

      {/* Today's Summary — Highlight Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Today Sales */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{todaySales}</p>
            <p className="text-sm text-gray-500">Today's Sales</p>
          </div>
        </div>

        {/* Today Revenue */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">₹{todayRevenue.toLocaleString('en-IN')}</p>
            <p className="text-sm text-gray-500">Today's Revenue</p>
          </div>
        </div>

        {/* Low Stock */}
        <Link to="/admin/pharmacy/medicines?stock=low" className="bg-white rounded-xl border border-amber-200 p-5 flex items-center gap-4 hover:shadow-sm transition">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{lowStockCount}</p>
            <p className="text-sm text-gray-500">Low Stock Items</p>
          </div>
        </Link>

        {/* Expiring Soon */}
        <Link to="/admin/pharmacy/batches?expiry=expiring_soon" className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 hover:shadow-sm transition">
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
            <Clock className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{expiringCount}</p>
            <p className="text-sm text-gray-500">Expiring Within 30 Days</p>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Link
          to="/admin/pharmacy/medicines/new"
          className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Medicine
        </Link>
        <Link
          to="/admin/pharmacy/batches/new"
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Stock / Purchase
        </Link>
        <Link
          to="/admin/pharmacy/sales/new"
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          <ShoppingCart className="w-4 h-4" /> Record Sale
        </Link>
      </div>

      {/* Bottom Grid: Recent Sales + Low Stock Alerts */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Recent Sales */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Sales</h2>
            <Link to="/admin/pharmacy/sales" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {sales.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <ShoppingCart className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No sales recorded yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {sales.map((s) => (
                <div key={s.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-gray-50 transition">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{s.medicine_name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {s.patient_name || 'Walk-in'} · {s.batch_number}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 text-sm">₹{Number(s.total_amount).toLocaleString('en-IN')}</p>
                    <p className="text-xs text-gray-400">{new Date(s.sale_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-xl border border-amber-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Low Stock Alerts</h2>
            <Link to="/admin/pharmacy/medicines?stock=low" className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {lowStock.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <Package className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">All medicines are well stocked</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {lowStock.slice(0, 6).map((m) => (
                <div key={m.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-gray-50 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                      <Pill className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{m.name}</p>
                      <p className="text-xs text-gray-400">{m.generic_name || m.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-xs font-semibold">
                      {m.stock_quantity ?? 0} left
                    </span>
                    <p className="text-xs text-gray-400 mt-1">Reorder at {m.reorder_level}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
