import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import API from '../../../services/api';

const INITIAL_FORM = {
  medicine: '',
  vendor: '',
  batch_number: '',
  manufacture_date: '',
  expiry_date: '',
  purchase_date: new Date().toISOString().split('T')[0],
  quantity_purchased: '',
  cost_price: '',
  selling_price: '',
};

export default function BatchForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [vendors, setVendors] = useState([]);

  // Fetch medicines and vendors on mount
  useEffect(() => {
    async function fetchOptions() {
      try {
        const [medRes, venRes] = await Promise.all([
          API.get('/pharmacy/medicines/?is_active=true'),
          API.get('/pharmacy/vendors/?is_active=true'),
        ]);
        setMedicines(medRes.data.results || medRes.data);
        setVendors(venRes.data.results || venRes.data);
      } catch {
        // Silent — dropdowns will be empty
      }
    }
    fetchOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Auto-fill selling_price when medicine changes
  const handleMedicineChange = (e) => {
    const medId = e.target.value;
    setForm((prev) => ({ ...prev, medicine: medId }));
    if (errors.medicine) {
      setErrors((prev) => ({ ...prev, medicine: '' }));
    }
    const selected = medicines.find((m) => String(m.id) === String(medId));
    if (selected && selected.selling_price) {
      setForm((prev) => ({ ...prev, selling_price: String(selected.selling_price) }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.medicine) errs.medicine = 'Medicine is required';
    if (!form.batch_number.trim()) errs.batch_number = 'Batch number is required';
    if (!form.expiry_date) errs.expiry_date = 'Expiry date is required';
    if (!form.purchase_date) errs.purchase_date = 'Purchase date is required';
    if (!form.quantity_purchased || Number(form.quantity_purchased) <= 0)
      errs.quantity_purchased = 'Quantity must be greater than 0';
    if (!form.cost_price || Number(form.cost_price) < 0)
      errs.cost_price = 'Cost price is required';
    if (!form.selling_price || Number(form.selling_price) < 0)
      errs.selling_price = 'Selling price is required';
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
      quantity_purchased: Number(form.quantity_purchased),
      cost_price: Number(form.cost_price),
      selling_price: Number(form.selling_price),
    };

    try {
      await API.post('/pharmacy/batches/', payload);
      navigate('/admin/pharmacy/batches');
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
        <h1 className="font-heading text-2xl font-bold text-gray-900">Add New Purchase</h1>
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
        {errors.detail && (
          <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg mb-5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {errors.detail}
          </div>
        )}

        {/* Batch Details */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-primary-700 uppercase tracking-wider mb-4">
            Batch Details
          </h2>
          <div className="space-y-4">
            {/* Medicine */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Medicine <span className="text-red-400">*</span>
              </label>
              <select
                name="medicine"
                value={form.medicine}
                onChange={handleMedicineChange}
                className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                  errors.medicine ? 'border-red-300' : 'border-gray-200'
                }`}
              >
                <option value="">Select medicine</option>
                {medicines.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
              {errors.medicine && <p className="text-xs text-red-500 mt-1">{errors.medicine}</p>}
            </div>

            {/* Vendor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Vendor
              </label>
              <select
                name="vendor"
                value={form.vendor}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              >
                <option value="">Select vendor</option>
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>

            {/* Batch Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Batch Number <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="batch_number"
                value={form.batch_number}
                onChange={handleChange}
                placeholder="e.g. BN-2026-001"
                className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                  errors.batch_number ? 'border-red-300' : 'border-gray-200'
                }`}
              />
              {errors.batch_number && <p className="text-xs text-red-500 mt-1">{errors.batch_number}</p>}
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {/* Manufacture Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Manufacture Date
                </label>
                <input
                  type="date"
                  name="manufacture_date"
                  value={form.manufacture_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                />
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Expiry Date <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  name="expiry_date"
                  value={form.expiry_date}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                    errors.expiry_date ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
                {errors.expiry_date && <p className="text-xs text-red-500 mt-1">{errors.expiry_date}</p>}
              </div>

              {/* Purchase Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Purchase Date <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  name="purchase_date"
                  value={form.purchase_date}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                    errors.purchase_date ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
                {errors.purchase_date && <p className="text-xs text-red-500 mt-1">{errors.purchase_date}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Quantity */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-primary-700 uppercase tracking-wider mb-4">
            Pricing &amp; Quantity
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {/* Quantity Purchased */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Quantity Purchased <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="quantity_purchased"
                value={form.quantity_purchased}
                onChange={handleChange}
                placeholder="0"
                min="1"
                className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                  errors.quantity_purchased ? 'border-red-300' : 'border-gray-200'
                }`}
              />
              {errors.quantity_purchased && <p className="text-xs text-red-500 mt-1">{errors.quantity_purchased}</p>}
            </div>

            {/* Cost Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Cost Price (&#8377;) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="cost_price"
                value={form.cost_price}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                  errors.cost_price ? 'border-red-300' : 'border-gray-200'
                }`}
              />
              {errors.cost_price && <p className="text-xs text-red-500 mt-1">{errors.cost_price}</p>}
            </div>

            {/* Selling Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Selling Price (&#8377;) <span className="text-red-400">*</span>
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
            {loading ? 'Saving...' : 'Save Purchase'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/pharmacy/batches')}
            className="px-6 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
