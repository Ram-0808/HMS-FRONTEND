import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, UserCheck, IndianRupee, TrendingUp, User,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer, Legend,
} from 'recharts';
import StatCard from '../../components/StatCard';
import API from '../../services/api';

const GENDER_COLORS = { male: '#0d9488', female: '#f59e0b', other: '#94a3b8' };
const PAYMENT_COLORS = { CASH: '#0d9488', CARD: '#6366f1', UPI: '#f59e0b' };
const PAYMENT_LABELS = { CASH: 'Cash', CARD: 'Card', UPI: 'UPI' };

// Custom tooltip for INR formatting
const currencyTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm text-sm">
        <p className="font-medium text-gray-700">{label}</p>
        <p className="text-primary-600 font-semibold">
          ₹{Number(payload[0].value).toLocaleString('en-IN')}
        </p>
      </div>
    );
  }
  return null;
};

const visitTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm text-sm">
        <p className="font-medium text-gray-700">{label}</p>
        <p className="text-blue-600 font-semibold">{payload[0].value} visits</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, chartsRes] = await Promise.all([
          API.get('/dashboard/stats/'),
          API.get('/dashboard/charts/'),
        ]);
        setStats(statsRes.data);
        setCharts(chartsRes.data);
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

  // Fill in any missing dates in the last 7 days with zero revenue/visits
  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const revenueData = last7Days.map((date) => {
    const entry = charts?.daily_revenue?.find((r) => r.date === date);
    const label = new Date(date + 'T00:00:00').toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short',
    });
    return { date: label, revenue: entry ? entry.revenue : 0 };
  });

  const visitsData = last7Days.map((date) => {
    const entry = charts?.daily_visits?.find((v) => v.date === date);
    const label = new Date(date + 'T00:00:00').toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short',
    });
    return { date: label, visits: entry ? entry.visits : 0 };
  });

  const genderData = charts ? [
    { name: 'Male', value: charts.gender_dist?.male || 0, color: GENDER_COLORS.male },
    { name: 'Female', value: charts.gender_dist?.female || 0, color: GENDER_COLORS.female },
    { name: 'Other', value: charts.gender_dist?.other || 0, color: GENDER_COLORS.other },
  ].filter((d) => d.value > 0) : [];

  const paymentData = (charts?.payment_dist || []).map((p) => ({
    name: PAYMENT_LABELS[p.method] || p.method,
    value: p.count,
    color: PAYMENT_COLORS[p.method] || '#94a3b8',
  }));

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-gray-900">Dashboard</h1>
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

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Daily Revenue Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Revenue — Last 7 Days</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
              />
              <Tooltip content={currencyTooltip} cursor={{ fill: '#f0fdfa' }} />
              <Bar
                dataKey="revenue"
                fill="#0d9488"
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gender Distribution Pie */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Patients by Gender</h2>
          </div>
          {genderData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {genderData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v, name) => [v, name]}
                  contentStyle={{
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span className="text-xs text-gray-600">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-[180px] text-gray-400">
              <User className="w-10 h-10 mb-2 opacity-40" />
              <p className="text-sm">No patient data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Second Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Daily Visits Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Patient Visits — Last 7 Days</h2>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={visitsData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={visitTooltip} cursor={{ fill: '#eff6ff' }} />
              <Bar
                dataKey="visits"
                fill="#6366f1"
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Method Distribution */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Payment Methods</h2>
          </div>
          {paymentData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {paymentData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v, name) => [v, name]}
                  contentStyle={{
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span className="text-xs text-gray-600">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-[180px] text-gray-400">
              <IndianRupee className="w-10 h-10 mb-2 opacity-40" />
              <p className="text-sm">No payment data yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
