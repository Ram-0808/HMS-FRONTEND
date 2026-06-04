import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserCheck, IndianRupee, TrendingUp, UserPlus } from 'lucide-react';
import StatCard from '../../components/StatCard';
import API from '../../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentPatients, setRecentPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, patientsRes] = await Promise.all([
          API.get('/dashboard/stats/'),
          API.get('/patients/?page_size=10'),
        ]);
        setStats(statsRes.data);
        setRecentPatients(patientsRes.data.results || patientsRes.data);
      } catch {
        setError('Failed to load dashboard data');
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
        <h1 className="font-heading text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link
          to="/admin/patients/new"
          className="flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Add Patient
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Users}
          value={stats?.total_patients ?? 0}
          label="Total Patients"
          color="primary"
        />
        <StatCard
          icon={UserCheck}
          value={stats?.today_patients ?? 0}
          label="Today's Patients"
          color="blue"
        />
        <StatCard
          icon={IndianRupee}
          value={`₹${Number(stats?.total_revenue ?? 0).toLocaleString('en-IN')}`}
          label="Total Revenue"
          color="green"
        />
        <StatCard
          icon={TrendingUp}
          value={`₹${Number(stats?.today_revenue ?? 0).toLocaleString('en-IN')}`}
          label="Today's Revenue"
          color="amber"
        />
      </div>

      {/* Recent Patients */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Recent Patients</h2>
          <Link
            to="/admin/patients"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View All
          </Link>
        </div>

        {recentPatients.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No patients recorded yet.</p>
            <Link
              to="/admin/patients/new"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-1 inline-block"
            >
              Add your first patient
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-primary-50 text-left">
                  <th className="px-5 py-3 font-semibold text-primary-800">Name</th>
                  <th className="px-5 py-3 font-semibold text-primary-800">Age</th>
                  <th className="px-5 py-3 font-semibold text-primary-800">Gender</th>
                  <th className="px-5 py-3 font-semibold text-primary-800">Fee</th>
                  <th className="px-5 py-3 font-semibold text-primary-800">Payment</th>
                  <th className="px-5 py-3 font-semibold text-primary-800">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentPatients.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-900">{p.name}</td>
                    <td className="px-5 py-3 text-gray-600">{p.age}</td>
                    <td className="px-5 py-3 text-gray-600">{p.gender_display}</td>
                    <td className="px-5 py-3 text-gray-600">₹{Number(p.fee_amount).toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3">
                      <span className="inline-block px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        {p.payment_method_display}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-400">
                      {new Date(p.created_at).toLocaleDateString('en-IN', {
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
