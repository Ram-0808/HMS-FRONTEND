import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Pencil, Trash2, Search, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import API from '../../services/api';
import ViewToggle from '../../components/ViewToggle';

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // View mode
  const [viewMode, setViewMode] = useState('grid');

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      params.set('page', page);

      const { data } = await API.get(`/doctors/?${params}`);
      setDoctors(data.results || data);
      const count = data.count || (data.results || data).length;
      setTotalPages(Math.ceil(count / 20) || 1);
    } catch {
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [page]);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this doctor from the website?')) return;
    try {
      await API.delete(`/doctors/${id}/`);
      fetchDoctors();
    } catch {
      alert('Failed to delete. Please try again.');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchDoctors();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-gray-900">Doctors</h1>
        <div className="flex items-center gap-3">
          <ViewToggle view={viewMode} onChange={setViewMode} />
          <Link
            to="/admin/doctors/new"
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Add Doctor
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or specialty..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </form>
      </div>

      {/* Loading / Empty */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full" />
        </div>
      ) : doctors.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No doctors found.</p>
          <Link
            to="/admin/doctors/new"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-1 inline-block"
          >
            Add your first doctor
          </Link>
        </div>
      ) : (
        <>
          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {doctors.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Photo */}
                  <div className="h-44 bg-primary-50 flex items-center justify-center relative">
                    {doc.photo ? (
                      <img
                        src={doc.photo}
                        alt={doc.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-primary-300" />
                    )}
                    {/* Active badge */}
                    <span
                      className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        doc.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {doc.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                    <p className="text-sm text-primary-600 font-medium">{doc.specialty}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{doc.qualification}</p>
                    {doc.bio && (
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">{doc.bio}</p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                      <Link
                        to={`/admin/doctors/${doc.id}/edit`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary-50 text-primary-700 hover:bg-primary-100 transition"
                      >
                        <Pencil className="w-3 h-3" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition"
                      >
                        <Trash2 className="w-3 h-3" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-primary-50 text-left">
                      <th className="px-4 py-3 font-semibold text-primary-800">Photo</th>
                      <th className="px-4 py-3 font-semibold text-primary-800">Name</th>
                      <th className="px-4 py-3 font-semibold text-primary-800">Specialty</th>
                      <th className="px-4 py-3 font-semibold text-primary-800">Qualification</th>
                      <th className="px-4 py-3 font-semibold text-primary-800">Status</th>
                      <th className="px-4 py-3 font-semibold text-primary-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {doctors.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center overflow-hidden">
                            {doc.photo ? (
                              <img src={doc.photo} alt={doc.name} className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-4 h-4 text-primary-300" />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900">{doc.name}</td>
                        <td className="px-4 py-3 text-primary-600 font-medium">{doc.specialty}</td>
                        <td className="px-4 py-3 text-gray-500">{doc.qualification}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              doc.is_active
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {doc.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/admin/doctors/${doc.id}/edit`}
                              className="p-1.5 rounded-lg hover:bg-primary-50 text-primary-600 transition"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(doc.id)}
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
