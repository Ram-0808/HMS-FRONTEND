import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import API from '../../../services/api';
import ViewToggle from '../../../components/ViewToggle';
import { useToast } from '../../../context/ToastContext';

export default function SaleList() {
  const toast = useToast();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [viewMode, setViewMode] = useState('list');

  // Filters
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (dateFrom) params.set('date_from', dateFrom);
      if (dateTo) params.set('date_to', dateTo);
      params.set('page', page);

      const { data } = await API.get(`/pharmacy/sales/?${params}`);
      setSales(data.results || data);
      const count = data.count || (data.results || data).length;
      setTotalPages(Math.ceil(count / 20) || 1);
      setTotalRevenue(data.total_revenue || 0);
    } catch {
      setSales([]);
      setTotalRevenue(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchSales();
  };

  const handleDateFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  // Re-fetch when date filters change
  useEffect(() => {
    if (dateFrom !== undefined || dateTo !== undefined) {
      fetchSales();
    }
  }, [dateFrom, dateTo]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sale record?')) return;
    try {
      await API.delete(`/pharmacy/sales/${id}/`);
      fetchSales();
    } catch {
      toast('Failed to delete sale. Please try again.', 'error');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-gray-900">Sales</h1>
        <div className="flex items-center gap-3">
          <ViewToggle view={viewMode} onChange={setViewMode} />
          <Link
          to="/admin/pharmacy/sales/new"
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          + Record Sale
        </Link>
        </div>
      </div>

      {/* Total Revenue Summary */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
        <p className="text-sm font-medium text-green-700">
          Total Revenue: &#8377;{Number(totalRevenue).toLocaleString('en-IN')}
        </p>
      </div>

      {/* Search + Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 space-y-4">
        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by medicine or patient name..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Search
          </button>
        </form>

        {/* Filter row */}
        <div className="flex flex-wrap gap-3">
          <input
            type="date"
            value={dateFrom}
            onChange={handleDateFilterChange(setDateFrom)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
            title="From date"
          />
          <input
            type="date"
            value={dateTo}
            onChange={handleDateFilterChange(setDateTo)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
            title="To date"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full" />
        </div>
      ) : sales.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 text-center py-16 text-gray-400">
          <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No sales found.</p>
          <Link
            to="/admin/pharmacy/sales/new"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-1 inline-block"
          >
            Record a sale
          </Link>
        </div>
      ) : (
        <>
          {/* List View */}
          {viewMode === 'list' && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-primary-50 text-left">
                      <th className="px-4 py-3 font-semibold text-primary-800">Date</th>
                      <th className="px-4 py-3 font-semibold text-primary-800">Medicine</th>
                      <th className="px-4 py-3 font-semibold text-primary-800">Batch #</th>
                      <th className="px-4 py-3 font-semibold text-primary-800">Patient</th>
                      <th className="px-4 py-3 font-semibold text-primary-800">Qty</th>
                      <th className="px-4 py-3 font-semibold text-primary-800">Unit Price (&#8377;)</th>
                      <th className="px-4 py-3 font-semibold text-primary-800">Total (&#8377;)</th>
                      <th className="px-4 py-3 font-semibold text-primary-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {sales.map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-gray-400">
                          {new Date(s.created_at || s.sale_date).toLocaleDateString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric',
                          })}
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900">{s.medicine_name || s.medicine_details?.name}</td>
                        <td className="px-4 py-3 text-gray-600">{s.batch_number || s.batch_details?.batch_number}</td>
                        <td className="px-4 py-3 text-gray-600">
                          {s.patient_name || s.patient_details?.name || 'Walk-in'}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{s.quantity}</td>
                        <td className="px-4 py-3 text-gray-600">&#8377;{Number(s.unit_price).toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3 text-gray-600">&#8377;{Number(s.total || s.quantity * s.unit_price).toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDelete(s.id)}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between text-sm">
                <span className="text-gray-500">Page {page} of {totalPages}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Grid View */}
          {viewMode === 'grid' && (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sales.map((s) => {
                  const patientName = s.patient_name || s.patient_details?.name;
                  const totalAmt = s.total || s.quantity * s.unit_price;

                  return (
                    <div key={s.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                      <p className="text-xs text-gray-400 mb-2">
                        {new Date(s.created_at || s.sale_date).toLocaleDateString('en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric',
                        })}
                      </p>
                      <div className="mb-2">
                        <h3 className="font-semibold text-gray-900">{s.medicine_name || s.medicine_details?.name}</h3>
                        <p className="text-sm text-gray-500">Batch #{s.batch_number || s.batch_details?.batch_number}</p>
                      </div>
                      <div className="mb-3">
                        {patientName ? (
                          <span className="text-sm text-gray-600">{patientName}</span>
                        ) : (
                          <span className="inline-block px-2.5 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">
                            Walk-in
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm mb-3">
                        <span className="text-gray-500">
                          {s.quantity} x &#8377;{Number(s.unit_price).toLocaleString('en-IN')}
                        </span>
                        <span className="font-bold text-gray-900">&#8377;{Number(totalAmt).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-gray-500">Page {page} of {totalPages}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
