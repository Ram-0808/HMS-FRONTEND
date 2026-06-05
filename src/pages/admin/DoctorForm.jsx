import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Upload, X, AlertCircle } from 'lucide-react';
import BackButton from '../../components/BackButton';
import { useToast } from '../../context/ToastContext';
import API from '../../services/api';

const INITIAL_FORM = {
  name: '',
  specialty: '',
  qualification: '',
  bio: '',
  is_active: true,
};

export default function DoctorForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState(INITIAL_FORM);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [existingPhoto, setExistingPhoto] = useState(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  // Fetch existing doctor data for edit mode
  useEffect(() => {
    if (!isEdit) return;
    async function fetchDoctor() {
      try {
        const { data } = await API.get(`/doctors/${id}/`);
        setForm({
          name: data.name,
          specialty: data.specialty,
          qualification: data.qualification,
          bio: data.bio || '',
          is_active: data.is_active,
        });
        if (data.photo) {
          setExistingPhoto(data.photo);
        }
      } catch {
        toast('Failed to load doctor data.', 'error');
        navigate('/admin/doctors');
      } finally {
        setFetching(false);
      }
    }
    fetchDoctor();
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, photo: 'Please select an image file' }));
      return;
    }
    // Validate file size (max 1MB)
    if (file.size > 1 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, photo: 'Image must be under 1MB' }));
      return;
    }

    setPhotoFile(file);
    setRemovePhoto(false);
    setErrors((prev) => ({ ...prev, photo: '' }));

    // Generate preview
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (isEdit && existingPhoto) {
      setRemovePhoto(true);
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Doctor name is required';
    if (!form.specialty.trim()) errs.specialty = 'Specialty is required';
    if (!form.qualification.trim()) errs.qualification = 'Qualification is required';
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

    // Use FormData for multipart upload (handles image + text fields)
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('specialty', form.specialty);
    formData.append('qualification', form.qualification);
    formData.append('bio', form.bio);
    formData.append('is_active', form.is_active);

    if (photoFile) {
      formData.append('photo', photoFile);
    }
    // If removing existing photo, send empty photo
    if (removePhoto) {
      formData.append('photo', '');
    }

    try {
      if (isEdit) {
        // Use PATCH with FormData — need to set content header for multipart
        await API.patch(`/doctors/${id}/`, formData);
      } else {
        await API.post('/doctors/', formData);
      }
      navigate('/admin/doctors');
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

  const displayPhoto = photoPreview || (!removePhoto ? existingPhoto : null);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <BackButton to="/admin/doctors" />
        <h1 className="font-heading text-2xl font-bold text-gray-900">
          {isEdit ? 'Edit Doctor' : 'Add New Doctor'}
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

        {/* Photo Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Doctor Photo
          </label>

          {displayPhoto ? (
            <div className="relative inline-block">
              <img
                src={displayPhoto}
                alt="Preview"
                className="w-40 h-40 rounded-2xl object-cover border border-gray-200"
              />
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition shadow"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-40 h-40 rounded-2xl border-2 border-dashed border-gray-300 cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 transition">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-xs text-gray-500 font-medium">Upload Photo</span>
              <span className="text-[10px] text-gray-400 mt-0.5">Max 1MB</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
              />
            </label>
          )}

          {/* Change photo button when photo exists */}
          {displayPhoto && (
            <label className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-50 text-gray-600 hover:bg-gray-100 cursor-pointer transition">
              <Upload className="w-3 h-3" />
              Change Photo
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
              />
            </label>
          )}

          {errors.photo && <p className="text-xs text-red-500 mt-1">{errors.photo}</p>}
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Doctor Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Dr. Anitha Sharma"
            className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
              errors.name ? 'border-red-300' : 'border-gray-200'
            }`}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>

        {/* Specialty + Qualification */}
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Specialty <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="specialty"
              value={form.specialty}
              onChange={handleChange}
              placeholder="e.g. Cardiologist"
              className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                errors.specialty ? 'border-red-300' : 'border-gray-200'
              }`}
            />
            {errors.specialty && <p className="text-xs text-red-500 mt-1">{errors.specialty}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Qualification <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="qualification"
              value={form.qualification}
              onChange={handleChange}
              placeholder="e.g. MBBS, MD"
              className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
              errors.qualification ? 'border-red-300' : 'border-gray-200'
            }`}
            />
            {errors.qualification && <p className="text-xs text-red-500 mt-1">{errors.qualification}</p>}
          </div>
        </div>

        {/* Bio */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Bio
          </label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Short description about the doctor's experience and expertise"
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none"
          />
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
              Show on website (Active)
            </span>
          </label>
          <p className="text-xs text-gray-400 mt-1 ml-7">
            Inactive doctors won't appear on the public "Who We Are" page
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : isEdit ? 'Update Doctor' : 'Add Doctor'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/doctors')}
            className="px-6 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
