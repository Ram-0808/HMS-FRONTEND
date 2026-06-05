import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Package, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import API from '../../../services/api';
import ViewToggle from '../../../components/ViewToggle';

export default function BatchList() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list');

  // Filters
  const [search, setSearch] = useState('');
  const [expiryFilter, setExpiryFilter] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (expiryFilter) params.set('expiry_status', expiryFilter);
      params.set('page', page);

      const { data } = await API.get(`/pharmacy/batches/?${params}`);
      setBatches(data.results || data);
      const count = data.count || (data.results || data).length;
      setTotalPages(Math.ceil(count / 20) || 1);
    } catch {
      setBatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, [page, expiryFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBatches();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this batch record?')) return;
    try {
      await API.delete(`/pharmacy/batches/${id}/`);
      fetchBatches();
    } catch {
      alert('Failed to delete. Please try again.');
    }
  };

  const getStatusBadge = (batch) => {
    if (batch.is_expired) {
      return (
        <span className="inline-block px-2.5 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
          Expired
        </span>
      );
    }
    if (batch.is_expiring_soon) {
      return (
        <span className="inline-block px-2.5 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
          Expiring Soon
        </span>
      );
    }
    return (
      <span className="inline-block px-2.5 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
        OK
      </span>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-gray-900">Stock / Purchases</h1>
        <div className="flex items-center gap-3">
          <ViewToggle view={viewMode} onChange={setViewMode} />
          <Link
          to="/admin/pharmacy/batches/new"
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          + Add Purchase
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
              placeholder="Search by batch number or medicine name..."
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
            value={expiryFilter}
            onChange={(e) => { setExpiryFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All</option>
            <option value="expired">Expired</option>
            <option value="expiring_soon">Expiring Soon</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full" />
        </div>
      ) : batches.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 text-center py-16 text-gray-400">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No batches found.</p>
          <Link
            to="/admin/pharmacy/batches/new"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-1 inline-block"
          >
            Add a new purchase
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
                      <th className="px-4 py-3 font-semibold text-primary-800">Medicine Name</th>
                      <th className="px-4 py-3 font-semibold text-primary-800">Batch #</th>
                      <th className="px-4 py-3 font-semibold text-primary-800">Qty Purchased</th>
                      <th className="px-4 py-3 font-semibold text-primary-800">Qty Remaining</th>
                      <th className="px-4 py-3 font-semibold text-primary-800">Cost Price (&#8377;)</th>
                      <th className="px-4 py-3 font-semibold text-primary-800">Selling Price (&#8377;)</th>
                      <th className="px-4 py-3 font-semibold text-primary-800">Expiry Date</th>
                      <th className="px-4 py-3 font-semibold text-primary-800">Status</th>
                      <th className="px-4 py-3 font-semibold text-primary-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {batches.map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-900">{b.medicine_name || b.medicine_details?.name}</td>
                        <td className="px-4 py-3 text-gray-600">{b.batch_number}</td>
                        <td className="px-4 py-3 text-gray-600">{b.quantity_purchased}</td>
                        <td className={`px-4 py-3 ${b.quantity_remaining <= 10 ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                          {b.quantity_remaining}
                        </td>
                        <td className="px-4 py-3 text-gray-600">&#8377;{Number(b.cost_price).toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3 text-gray-600">&#8377;{Number(b.selling_price).toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3 text-gray-400">
                          {new Date(b.expiry_date).toLocaleDateString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric',
                          })}
                        </td>
                        <td className="px-4 py-3">{getStatusBadge(b)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/admin/pharmacy/batches/${b.id}/edit`}
                              className="p-1.5 rounded-lg hover:bg-primary-50 text-primary-600 transition"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(b.id)}
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
                {batches.map((b) => {
                  const purchased = b.quantity_purchased || 0;
                  const remaining = b.quantity_remaining || 0;
                  const pct = purchased > 0 ? (remaining / purchased) * 100 : 0;
                  let expiryBadgeClasses = 'bg-green-100 text-green-700';
                  let expiryLabel = 'OK';
                  if (b.is_expired) { expiryBadgeClasses = 'bg-red-100 text-red-700'; expiryLabel = 'Expired'; }
                  else if (b.is_expiring_soon) { expiryBadgeClasses = 'bg-amber-100 text-amber-700'; expiryLabel = 'Expiring Soon'; }

                  return (
                    <div key={b.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                      <div className="mb-2">
                        <h3 className="font-semibold text-gray-900">{b.medicine_name || b.medicine_details?.name}</h3>
                        <p className="text-sm text-gray-500">Batch #{b.batch_number}</p>
                      </div>
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-500">Qty: {remaining} / {purchased}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary-500 rounded-full transition-all"
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm mb-3">
                        <div>
                          <p className="text-gray-400">Cost</p>
                          <p className="text-gray-700 font-medium">&#8377;{Number(b.cost_price).toLocaleString('en-IN')}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400">Selling</p>
                          <p className="text-gray-700 font-medium">&#8377;{Number(b.selling_price).toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-gray-400">
                          Exp: {new Date(b.expiry_date).toLocaleDateString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric',
                          })}
                        </span>
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${expiryBadgeClasses}`}>
                          {expiryLabel}
                        </span>
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                        <Link
                          to={`/admin/pharmacy/batches/${b.id}/edit`}
                          className="p-1.5 rounded-lg hover:bg-primary-50 text-primary-600 transition"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(b.id)}
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
