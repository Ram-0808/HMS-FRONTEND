import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, AlertCircle } from 'lucide-react';
import BackButton from '../../../components/BackButton';
import { useToast } from '../../../context/ToastContext';
import API from '../../../services/api';

export default function SaleForm() {
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState({
    medicine: '',
    batch: '',
    quantity: '',
    unit_price: '',
    patient: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Dropdown data
  const [medicines, setMedicines] = useState([]);
  const [batches, setBatches] = useState([]);
  const [patientSearch, setPatientSearch] = useState('');
  const [patientResults, setPatientResults] = useState([]);
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [selectedPatientName, setSelectedPatientName] = useState('');
  const [selectedBatch, setSelectedBatch] = useState(null);
  const patientSearchRef = useRef(null);
  const patientDropdownRef = useRef(null);

  // Computed total
  const calculatedTotal =
    form.quantity && form.unit_price
      ? Number(form.quantity) * Number(form.unit_price)
      : 0;

  // Fetch medicines on mount
  useEffect(() => {
    async function fetchMedicines() {
      try {
        const { data } = await API.get('/pharmacy/medicines/?is_active=true');
        setMedicines(data.results || data);
      } catch {
        // Silent — dropdown will be empty
      }
    }
    fetchMedicines();
  }, []);

  // Close patient dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        patientDropdownRef.current &&
        !patientDropdownRef.current.contains(e.target) &&
        patientSearchRef.current &&
        !patientSearchRef.current.contains(e.target)
      ) {
        setShowPatientDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch batches when medicine changes
  const handleMedicineChange = async (e) => {
    const medId = e.target.value;
    setForm((prev) => ({ ...prev, medicine: medId, batch: '', unit_price: '', quantity: '' }));
    setSelectedBatch(null);
    setBatches([]);
    if (errors.medicine) setErrors((prev) => ({ ...prev, medicine: '' }));

    if (!medId) return;

    try {
      const { data } = await API.get(`/pharmacy/batches/?medicine=${medId}`);
      const allBatches = data.results || data;
      // Filter to only batches with quantity_remaining > 0
      const available = allBatches.filter((b) => b.quantity_remaining > 0);
      setBatches(available);
    } catch {
      setBatches([]);
    }
  };

  // Auto-fill unit_price when batch changes
  const handleBatchChange = (e) => {
    const batchId = e.target.value;
    setForm((prev) => ({ ...prev, batch: batchId, quantity: '' }));
    if (errors.batch) setErrors((prev) => ({ ...prev, batch: '' }));

    const batch = batches.find((b) => String(b.id) === String(batchId));
    if (batch) {
      setSelectedBatch(batch);
      setForm((prev) => ({ ...prev, unit_price: String(batch.selling_price) }));
    } else {
      setSelectedBatch(null);
      setForm((prev) => ({ ...prev, unit_price: '' }));
    }
  };

  // Search patients as user types
  const handlePatientSearch = async (value) => {
    setPatientSearch(value);
    setForm((prev) => ({ ...prev, patient: '' }));
    setSelectedPatientName('');

    if (value.trim().length < 2) {
      setPatientResults([]);
      setShowPatientDropdown(false);
      return;
    }

    try {
      const { data } = await API.get(`/patients/?search=${encodeURIComponent(value.trim())}`);
      const results = data.results || data;
      setPatientResults(results);
      setShowPatientDropdown(results.length > 0);
    } catch {
      setPatientResults([]);
      setShowPatientDropdown(false);
    }
  };

  const selectPatient = (patient) => {
    setForm((prev) => ({ ...prev, patient: String(patient.id) }));
    setSelectedPatientName(patient.name);
    setPatientSearch(patient.name);
    setShowPatientDropdown(false);
  };

  const clearPatient = () => {
    setForm((prev) => ({ ...prev, patient: '' }));
    setSelectedPatientName('');
    setPatientSearch('');
    setPatientResults([]);
    setShowPatientDropdown(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.medicine) errs.medicine = 'Medicine is required';
    if (!form.batch) errs.batch = 'Batch is required';
    if (!form.quantity || Number(form.quantity) <= 0)
      errs.quantity = 'Quantity must be greater than 0';
    if (selectedBatch && Number(form.quantity) > selectedBatch.quantity_remaining)
      errs.quantity = `Only ${selectedBatch.quantity_remaining} units available in this batch`;
    if (!form.unit_price || Number(form.unit_price) < 0)
      errs.unit_price = 'Unit price is required';
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
      batch: Number(form.batch),
      quantity: Number(form.quantity),
      unit_price: Number(form.unit_price),
      ...(form.patient ? { patient: Number(form.patient) } : {}),
    };

    try {
      await API.post('/pharmacy/sales/', payload);
      navigate('/admin/pharmacy/sales');
    } catch (err) {
      const serverErrors = err.response?.data;
      if (serverErrors) {
        const formatted = {};
        Object.entries(serverErrors).forEach(([key, val]) => {
          formatted[key] = Array.isArray(val) ? val[0] : val;
        });
        setErrors(formatted);
      } else {
        toast('Something went wrong. Please try again.', 'error');
      }
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <BackButton to="/admin/pharmacy/sales" />
        <h1 className="font-heading text-2xl font-bold text-gray-900">Record Sale</h1>
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

        {/* Medicine Selection */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-primary-700 uppercase tracking-wider mb-4">
            Select Medicine &amp; Batch
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

            {/* Batch */}
            {form.medicine && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Batch <span className="text-red-400">*</span>
                </label>
                <select
                  name="batch"
                  value={form.batch}
                  onChange={handleBatchChange}
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                    errors.batch ? 'border-red-300' : 'border-gray-200'
                  }`}
                >
                  <option value="">Select batch</option>
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.batch_number} — Qty: {b.quantity_remaining} — Exp: {new Date(b.expiry_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </option>
                  ))}
                </select>
                {errors.batch && <p className="text-xs text-red-500 mt-1">{errors.batch}</p>}
                {batches.length === 0 && form.medicine && (
                  <p className="text-xs text-amber-600 mt-1">No available batches for this medicine.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sale Details */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-primary-700 uppercase tracking-wider mb-4">
            Sale Details
          </h2>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Quantity <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="0"
                  min="1"
                  max={selectedBatch?.quantity_remaining || undefined}
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                    errors.quantity ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
                {selectedBatch && (
                  <p className="text-xs text-gray-400 mt-1">
                    Available: {selectedBatch.quantity_remaining} units
                  </p>
                )}
                {errors.quantity && <p className="text-xs text-red-500 mt-1">{errors.quantity}</p>}
              </div>

              {/* Unit Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Unit Price (&#8377;) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="unit_price"
                  value={form.unit_price}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                    errors.unit_price ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
                {errors.unit_price && <p className="text-xs text-red-500 mt-1">{errors.unit_price}</p>}
              </div>
            </div>

            {/* Calculated Total */}
            {calculatedTotal > 0 && (
              <div className="bg-primary-50 rounded-lg p-4">
                <p className="text-sm font-medium text-primary-700">
                  Total: &#8377;{Number(calculatedTotal).toLocaleString('en-IN')}
                </p>
              </div>
            )}

            {/* Patient Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Patient (optional)
              </label>
              <div className="relative">
                <input
                  ref={patientSearchRef}
                  type="text"
                  value={patientSearch}
                  onChange={(e) => handlePatientSearch(e.target.value)}
                  placeholder="Search patient by name..."
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                />
                {selectedPatientName && (
                  <button
                    type="button"
                    onClick={clearPatient}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    &times;
                  </button>
                )}

                {/* Patient dropdown */}
                {showPatientDropdown && patientResults.length > 0 && (
                  <div
                    ref={patientDropdownRef}
                    className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto"
                  >
                    {patientResults.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => selectPatient(p)}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-primary-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900">{p.name}</span>
                        <span className="text-gray-400 ml-2">Age: {p.age}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {selectedPatientName ? `Selected: ${selectedPatientName}` : 'Leave empty for Walk-in (No Patient)'}
              </p>
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
            {loading ? 'Saving...' : 'Record Sale'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/pharmacy/sales')}
            className="px-6 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
