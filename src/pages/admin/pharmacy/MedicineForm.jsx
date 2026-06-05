import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import API from '../../../services/api';

const CATEGORY_OPTIONS = [
  { value: 'TABLET', label: 'Tablets' },
  { value: 'CAPSULE', label: 'Capsules' },
  { value: 'SYRUP', label: 'Syrup' },
  { value: 'INJECTION', label: 'Injection' },
  { value: 'CREAM', label: 'Cream' },
  { value: 'DROPS', label: 'Drops' },
  { value: 'INHALER', label: 'Inhaler' },
  { value: 'OTHER', label: 'Other' },
];

const UNIT_TYPE_OPTIONS = [
  { value: 'STRIP', label: 'Strip' },
  { value: 'BOTTLE', label: 'Bottle' },
  { value: 'TUBE', label: 'Tube' },
  { value: 'VIAL', label: 'Vial' },
  { value: 'BOX', label: 'Box' },
  { value: 'PIECE', label: 'Piece' },
  { value: 'SACHET', label: 'Sachet' },
];

const INITIAL_FORM = {
  name: '',
  generic_name: '',
  category: 'TABLET',
  manufacturer: '',
  description: '',
  unit_type: 'STRIP',
  selling_price: '',
  reorder_level: 10,
  is_active: true,
};

export default function MedicineForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  // Fetch existing medicine data for edit mode
  useEffect(() => {
    if (!isEdit) return;
    async function fetchMedicine() {
      try {
        const { data } = await API.get(`/pharmacy/medicines/${id}/`);
        setForm({
          name: data.name,
          generic_name: data.generic_name || '',
          category: data.category,
          manufacturer: data.manufacturer || '',
          description: data.description || '',
          unit_type: data.unit_type,
          selling_price: data.selling_price,
          reorder_level: data.reorder_level ?? 10,
          is_active: data.is_active ?? true,
        });
      } catch {
        alert('Failed to load medicine data.');
        navigate('/admin/pharmacy/medicines');
      } finally {
        setFetching(false);
      }
    }
    fetchMedicine();
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Medicine name is required';
    if (!form.selling_price || Number(form.selling_price) < 0) errs.selling_price = 'Valid selling price is required';
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
      selling_price: Number(form.selling_price),
      reorder_level: Number(form.reorder_level),
    };

    try {
      if (isEdit) {
        await API.patch(`/pharmacy/medicines/${id}/`, payload);
      } else {
        await API.post('/pharmacy/medicines/', payload);
      }
      navigate('/admin/pharmacy/medicines');
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
          {isEdit ? 'Edit Medicine' : 'Add New Medicine'}
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

        {/* Medicine Details */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-primary-700 uppercase tracking-wider mb-4">
            Medicine Details
          </h2>
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Medicine Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Paracetamol 500mg"
                className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                  errors.name ? 'border-red-300' : 'border-gray-200'
                }`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Generic Name + Manufacturer */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Generic Name
                </label>
                <input
                  type="text"
                  name="generic_name"
                  value={form.generic_name}
                  onChange={handleChange}
                  placeholder="e.g. Paracetamol"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Manufacturer
                </label>
                <input
                  type="text"
                  name="manufacturer"
                  value={form.manufacturer}
                  onChange={handleChange}
                  placeholder="e.g. Cipla"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Category + Unit Type */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Category
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Unit Type
                </label>
                <select
                  name="unit_type"
                  value={form.unit_type}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                >
                  {UNIT_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Medicine description (optional)"
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-primary-700 uppercase tracking-wider mb-4">
            Pricing & Stock
          </h2>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Selling Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Selling Price (₹) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="selling_price"
                  value={form.selling_price}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                    errors.selling_price ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
                {errors.selling_price && <p className="text-xs text-red-500 mt-1">{errors.selling_price}</p>}
              </div>

              {/* Reorder Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Reorder Level
                </label>
                <input
                  type="number"
                  name="reorder_level"
                  value={form.reorder_level}
                  onChange={handleChange}
                  placeholder="10"
                  min="0"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Active toggle */}
        <div className="mb-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">
              Active (available for sale)
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : isEdit ? 'Update Medicine' : 'Add Medicine'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/pharmacy/medicines')}
            className="px-6 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
