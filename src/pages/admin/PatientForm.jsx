import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import API from '../../services/api';

const GENDER_OPTIONS = [
  { value: 'M', label: 'Male' },
  { value: 'F', label: 'Female' },
  { value: 'O', label: 'Other' },
];

const PAYMENT_OPTIONS = [
  { value: 'CASH', label: 'Cash' },
  { value: 'CARD', label: 'Card' },
  { value: 'UPI', label: 'UPI' },
];

const INITIAL_FORM = {
  name: '',
  age: '',
  gender: 'M',
  phone: '',
  address: '',
  problem: '',
  diagnosis: '',
  visit_count: 1,
  fee_amount: '',
  payment_method: 'CASH',
};

export default function PatientForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  // Fetch existing patient data for edit mode
  useEffect(() => {
    if (!isEdit) return;
    async function fetchPatient() {
      try {
        const { data } = await API.get(`/patients/${id}/`);
        setForm({
          name: data.name,
          age: data.age,
          gender: data.gender,
          phone: data.phone || '',
          address: data.address || '',
          problem: data.problem,
          diagnosis: data.diagnosis || '',
          visit_count: data.visit_count,
          fee_amount: data.fee_amount,
          payment_method: data.payment_method,
        });
      } catch {
        alert('Failed to load patient data.');
        navigate('/admin/patients');
      } finally {
        setFetching(false);
      }
    }
    fetchPatient();
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Patient name is required';
    if (!form.age || Number(form.age) < 0) errs.age = 'Age is required';
    if (Number(form.age) > 120) errs.age = 'Age must be under 120';
    if (!form.problem.trim()) errs.problem = 'Problem description is required';
    if (!form.fee_amount || Number(form.fee_amount) < 0) errs.fee_amount = 'Fee amount is required';
    if (form.phone && !/^\d{10}$/.test(form.phone)) errs.phone = 'Phone must be exactly 10 digits';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    const payload = {
      ...form,
      age: Number(form.age),
      visit_count: Number(form.visit_count),
      fee_amount: Number(form.fee_amount),
    };

    try {
      if (isEdit) {
        await API.patch(`/patients/${id}/`, payload);
      } else {
        await API.post('/patients/', payload);
      }
      navigate('/admin/patients');
    } catch (err) {
      const serverErrors = err.response?.data;
      if (serverErrors) {
        const formatted = {};
        Object.entries(serverErrors).forEach(([key, val]) => {
          formatted[key] = Array.isArray(val) ? val[0] : val;
        });
        setErrors(formatted);
      } else {
        alert('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-heading text-2xl font-bold text-gray-900">
          {isEdit ? 'Edit Patient' : 'Add New Patient'}
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
        {/* General errors */}
        {errors.nonFieldErrors && (
          <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg mb-5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {errors.nonFieldErrors}
          </div>
        )}

        {/* Personal Info */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-primary-700 uppercase tracking-wider mb-4">
            Personal Information
          </h2>
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Patient Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full name"
                className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                  errors.name ? 'border-red-300' : 'border-gray-200'
                }`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Age <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="Age"
                  min="0"
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                    errors.age ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
                {errors.age && <p className="text-xs text-red-500 mt-1">{errors.age}</p>}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Gender
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                >
                  {GENDER_OPTIONS.map((g) => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="10-digit phone number"
                maxLength={10}
                className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                  errors.phone ? 'border-red-300' : 'border-gray-200'
                }`}
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Patient address"
                rows={2}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none"
              />
            </div>
          </div>
        </div>

        {/* Medical Info */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-primary-700 uppercase tracking-wider mb-4">
            Medical Information
          </h2>
          <div className="space-y-4">
            {/* Problem */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Problem / Reason for Visit <span className="text-red-400">*</span>
              </label>
              <textarea
                name="problem"
                value={form.problem}
                onChange={handleChange}
                placeholder="Describe the problem or reason for visit"
                rows={4}
                className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none ${
                  errors.problem ? 'border-red-300' : 'border-gray-200'
                }`}
              />
              {errors.problem && <p className="text-xs text-red-500 mt-1">{errors.problem}</p>}
            </div>

            {/* Diagnosis */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Diagnosis</label>
              <textarea
                name="diagnosis"
                value={form.diagnosis}
                onChange={handleChange}
                placeholder="Diagnosis details (optional)"
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none"
              />
            </div>

            {/* Visit count */}
            <div className="w-40">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Visit Count</label>
              <input
                type="number"
                name="visit_count"
                value={form.visit_count}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
            </div>
          </div>
        </div>

        {/* Billing Info */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-primary-700 uppercase tracking-wider mb-4">
            Billing Information
          </h2>
          <div className="space-y-4">
            {/* Fee */}
            <div className="w-60">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Fee Amount (₹) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="fee_amount"
                value={form.fee_amount}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                  errors.fee_amount ? 'border-red-300' : 'border-gray-200'
                }`}
              />
              {errors.fee_amount && <p className="text-xs text-red-500 mt-1">{errors.fee_amount}</p>}
            </div>

            {/* Payment method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <div className="flex gap-3">
                {PAYMENT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, payment_method: opt.value }))}
                    className={`flex-1 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                      form.payment_method === opt.value
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : isEdit ? 'Update Patient' : 'Save Patient'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/patients')}
            className="px-6 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
