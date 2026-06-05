import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Pill, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import API from '../../../services/api';
import ViewToggle from '../../../components/ViewToggle';

const CATEGORY_OPTIONS = [
  { value: '', label: 'All Categories' },
  { value: 'TABLET', label: 'Tablets' },
  { value: 'CAPSULE', label: 'Capsules' },
  { value: 'SYRUP', label: 'Syrup' },
  { value: 'INJECTION', label: 'Injection' },
  { value: 'CREAM', label: 'Cream' },
  { value: 'DROPS', label: 'Drops' },
  { value: 'INHALER', label: 'Inhaler' },
  { value: 'OTHER', label: 'Other' },
];

const STOCK_STATUS_OPTIONS = [
  { value: '', label: 'All Stock Status' },
  { value: 'low', label: 'Low Stock' },
  { value: 'out', label: 'Out of Stock' },
];

export default function MedicineList() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list');

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [stockStatus, setStockStatus] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      if (stockStatus) params.set('stock', stockStatus);
      params.set('page', page);

      const { data } = await API.get(`/pharmacy/medicines/?${params}`);
      setMedicines(data.results || data);
      const count = data.count || (data.results || data).length;
      setTotalPages(Math.ceil(count / 20) || 1);
    } catch {
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, [page, category, stockStatus]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchMedicines();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this medicine?')) return;
    try {
      await API.delete(`/pharmacy/medicines/${id}/`);
      fetchMedicines();
    } catch {
      alert('Failed to delete. Please try again.');
    }
  };

  const getStockBadge = (medicine) => {
    const qty = medicine.stock_quantity ?? 0;
    const reorder = medicine.reorder_level ?? 10;

    if (qty === 0) {
      return (
        <span className="inline-block px-2.5 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
          Out of Stock
        </span>
      );
    }
    if (qty <= reorder) {
      return (
        <span className="inline-block px-2.5 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
          Low Stock
        </span>
      );
    }
    return (
      <span className="inline-block px-2.5 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
        In Stock
      </span>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-gray-900">Medicines</h1>
        <div className="flex items-center gap-3">
          <ViewToggle view={viewMode} onChange={setViewMode} />
          <Link
          to="/admin/pharmacy/medicines/new"
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          + Add Medicine
        </Link>
        </div>
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
              placeholder="Search by medicine name or generic name..."
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
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <select
            value={stockStatus}
            onChange={(e) => { setStockStatus(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {STOCK_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full" />
        </div>
      ) : medicines.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 text-center py-16 text-gray-400">
          <Pill className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No medicines found.</p>
          <Link
            to="/admin/pharmacy/medicines/new"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-1 inline-block"
          >
            Add a new medicine
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
                      <th className="px-4 py-3 font-semibold text-primary-800">Name</th>
                      <th className="px-4 py-3 font-semibold text-primary-800">Generic Name</th>
                      <th className="px-4 py-3 font-semibold text-primary-800">Category</th>
                      <th className="px-4 py-3 font-semibold text-primary-800">Unit</th>
                      <th className="px-4 py-3 font-semibold text-primary-800">MRP (&#8377;)</th>
                      <th className="px-4 py-3 font-semibold text-primary-800">Stock</th>
                      <th className="px-4 py-3 font-semibold text-primary-800">Status</th>
                      <th className="px-4 py-3 font-semibold text-primary-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {medicines.map((m) => (
                      <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-900">{m.name}</td>
                        <td className="px-4 py-3 text-gray-600">{m.generic_name || '—'}</td>
                        <td className="px-4 py-3 text-gray-600">{m.category_display || m.category}</td>
                        <td className="px-4 py-3 text-gray-600">{m.unit_type_display || m.unit_type}</td>
                        <td className="px-4 py-3 text-gray-600">
                          &#8377;{Number(m.selling_price ?? 0).toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{m.stock_quantity ?? 0}</td>
                        <td className="px-4 py-3">{getStockBadge(m)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/admin/pharmacy/medicines/${m.id}/edit`}
                              className="p-1.5 rounded-lg hover:bg-primary-50 text-primary-600 transition"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(m.id)}
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
                {medicines.map((m) => {
                  const qty = m.stock_quantity ?? 0;
                  let stockBadgeClasses = 'bg-green-100 text-green-700';
                  let stockLabel = 'In Stock';
                  if (qty === 0) { stockBadgeClasses = 'bg-red-100 text-red-700'; stockLabel = 'Out of Stock'; }
                  else if (qty <= (m.reorder_level ?? 10)) { stockBadgeClasses = 'bg-amber-100 text-amber-700'; stockLabel = 'Low Stock'; }

                  return (
                    <div key={m.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{m.name}</h3>
                          <p className="text-sm text-gray-500">{m.generic_name || '—'}</p>
                        </div>
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          m.is_active !== false
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {m.is_active !== false ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="mb-3">
                        <span className="inline-block px-2.5 py-0.5 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                          {m.category_display || m.category}
                        </span>
                        <span className="ml-2 text-xs text-gray-500">{m.unit_type_display || m.unit_type}</span>
                      </div>
                      <div className="flex items-end justify-between mb-3">
                        <div>
                          <span className="text-2xl font-bold text-gray-900">{qty}</span>
                          <span className="text-sm text-gray-500 ml-1">units</span>
                          <div className="mt-1">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${stockBadgeClasses}`}>
                              {stockLabel}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">&#8377;{Number(m.selling_price ?? 0).toLocaleString('en-IN')}</p>
                          <p className="text-xs text-gray-400">MRP</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                        <Link
                          to={`/admin/pharmacy/medicines/${m.id}/edit`}
                          className="p-1.5 rounded-lg hover:bg-primary-50 text-primary-600 transition"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(m.id)}
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
