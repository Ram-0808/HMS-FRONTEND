import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Pencil, Trash2, Search, UserPlus } from 'lucide-react';
import API from '../../services/api';

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/doctors/');
      setDoctors(data.results || data);
    } catch {
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this doctor from the website?')) return;
    try {
      await API.delete(`/doctors/${id}/`);
      fetchDoctors();
    } catch {
      alert('Failed to delete. Please try again.');
    }
  };

  const filtered = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-gray-900">Doctors</h1>
        <Link
          to="/admin/doctors/new"
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Add Doctor
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or specialty..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Doctor Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-16">
            <div className="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full text-center py-16 text-gray-400">
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
          filtered.map((doc) => (
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
          ))
        )}
      </div>
    </div>
  );
}
