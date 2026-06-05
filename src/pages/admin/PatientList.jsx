import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import API from '../../services/api';
import ViewToggle from '../../components/ViewToggle';

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [gender, setGender] = useState('');
  const [payment, setPayment] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // View mode
  const [viewMode, setViewMode] = useState('list');

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (gender) params.set('gender', gender);
      if (payment) params.set('payment_method', payment);
      if (dateFrom) params.set('date_from', dateFrom);
      if (dateTo) params.set('date_to', dateTo);
      params.set('page', page);

      const { data } = await API.get(`/patients/?${params}`);
      setPatients(data.results || data);
      const count = data.count || (data.results || data).length;
      setTotalPages(Math.ceil(count / 20) || 1);
    } catch {
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [page, gender, payment]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPatients();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this patient record?')) return;
    try {
      await API.delete(`/patients/${id}/`);
      fetchPatients();
    } catch {
      alert('Failed to delete. Please try again.');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-gray-900">Patient Records</h1>
        <div className="flex items-center gap-3">
          <ViewToggle view={viewMode} onChange={setViewMode} />
          <Link
            to="/admin/patients/new"
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            + Add Patient
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
              placeholder="Search by patient name..."
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
            value={gender}
            onChange={(e) => { setGender(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Genders</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="O">Other</option>
          </select>

          <select
            value={payment}
            onChange={(e) => { setPayment(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Payments</option>
            <option value="CASH">Cash</option>
            <option value="CARD">Card</option>
            <option value="UPI">UPI</option>
          </select>

          <input
            type="date"
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
            title="From date"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
            title="To date"
          />
        </div>
      </div>

      {/* Loading / Empty */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full" />
        </div>
      ) : patients.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No patients found.</p>
          <Link
            to="/admin/patients/new"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-1 inline-block"
          >
            Add a new patient
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
                      <th className="px-4 py-3 font-semibold text-primary-800">Age</th>
                      <th className="px-4 py-3 font-semibold text-primary-800">Gender</th>
                      <th className="px-4 py-3 font-semibold text-primary-800">Visits</th>
                      <th className="px-4 py-3 font-semibold text-primary-800">Fee</th>
                      <th className="px-4 py-3 font-semibold text-primary-800">Payment</th>
                      <th className="px-4 py-3 font-semibold text-primary-800">Date</th>
                      <th className="px-4 py-3 font-semibold text-primary-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {patients.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                        <td className="px-4 py-3 text-gray-600">{p.age}</td>
                        <td className="px-4 py-3 text-gray-600">{p.gender_display}</td>
                        <td className="px-4 py-3 text-gray-600">{p.visit_count}</td>
                        <td className="px-4 py-3 text-gray-600">₹{Number(p.fee_amount).toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3">
                          <span className="inline-block px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                            {p.payment_method_display}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400">
                          {new Date(p.created_at).toLocaleDateString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric',
                          })}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/admin/patients/${p.id}/edit`}
                              className="p-1.5 rounded-lg hover:bg-primary-50 text-primary-600 transition"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(p.id)}
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
            </div>
          )}

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {patients.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{p.name}</h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        p.gender === 'M'
                          ? 'bg-blue-100 text-blue-700'
                          : p.gender === 'F'
                          ? 'bg-pink-100 text-pink-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {p.gender_display}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">Age: {p.age}</p>
                  {p.problem && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{p.problem}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-900">
                      ₹{Number(p.fee_amount).toLocaleString('en-IN')}
                    </span>
                    <span className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded-full text-[10px] font-semibold">
                      {p.visit_count} {p.visit_count === 1 ? 'visit' : 'visits'}
                    </span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[10px] font-medium">
                      {p.payment_method_display}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-400">
                      {new Date(p.created_at).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </span>
                    <div className="flex items-center gap-1">
                      <Link
                        to={`/admin/patients/${p.id}/edit`}
                        className="p-1.5 rounded-lg hover:bg-primary-50 text-primary-600 transition"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="mt-4 px-1 py-3 flex items-center justify-between text-sm">
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
    </div>
  );
}
