import { useState, useEffect } from 'react';
import { Settings, Upload, X, Save, AlertCircle, CheckCircle } from 'lucide-react';
import API from '../../services/api';

export default function SiteSettings() {
  const [form, setForm] = useState({
    hero_tagline: '',
    about_story: '',
    vision_statement: '',
    phone: '',
    emergency_phone: '',
    email: '',
    address: '',
    working_hours: '',
  });
  const [hospitalImage, setHospitalImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data } = await API.get('/settings/');
        setForm({
          hero_tagline: data.hero_tagline || '',
          about_story: data.about_story || '',
          vision_statement: data.vision_statement || '',
          phone: data.phone || '',
          emergency_phone: data.emergency_phone || '',
          email: data.email || '',
          address: data.address || '',
          working_hours: data.working_hours || '',
        });
        if (data.hospital_image) {
          setExistingImage(data.hospital_image);
        }
      } catch {
        // Settings don't exist yet — that's fine, form stays empty
      } finally {
        setFetching(false);
      }
    }
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, hospital_image: 'Please select an image file' }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, hospital_image: 'Image must be under 5MB' }));
      return;
    }
    setHospitalImage(file);
    setRemoveImage(false);
    setErrors((prev) => ({ ...prev, hospital_image: '' }));
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setHospitalImage(null);
    setImagePreview(null);
    if (existingImage) setRemoveImage(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (hospitalImage) {
      formData.append('hospital_image', hospitalImage);
    }
    if (removeImage) {
      formData.append('hospital_image', '');
    }

    try {
      await API.patch('/settings/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSaved(true);
      if (hospitalImage) {
        // Re-fetch to get the new image URL
        const { data } = await API.get('/settings/');
        if (data.hospital_image) {
          setExistingImage(data.hospital_image);
          setImagePreview(null);
          setHospitalImage(null);
        }
      }
      setRemoveImage(false);
      setTimeout(() => setSaved(false), 3000);
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

  const displayImage = imagePreview || (!removeImage ? existingImage : null);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
          <Settings className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Site Settings</h1>
          <p className="text-sm text-gray-500">Manage what appears on the public website</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Success message */}
        {saved && (
          <div className="flex items-center gap-2 bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg animate-fade-in-up">
            <CheckCircle className="w-4 h-4 shrink-0" />
            Settings saved successfully!
          </div>
        )}

        {/* Hospital Image */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-primary-700 uppercase tracking-wider mb-4">
            Hospital Building Photo
          </h2>
          <p className="text-xs text-gray-400 mb-4">
            This image appears on the About Us page. Recommended: landscape photo, at least 800px wide.
          </p>

          {displayImage ? (
            <div className="relative inline-block mb-3">
              <img
                src={displayImage}
                alt="Hospital"
                className="w-full max-w-md h-52 rounded-xl object-cover border border-gray-200"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition shadow"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full max-w-md h-52 rounded-xl border-2 border-dashed border-gray-300 cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 transition mb-3">
              <Upload className="w-10 h-10 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500 font-medium">Upload Hospital Photo</span>
              <span className="text-xs text-gray-400 mt-0.5">JPG or PNG, max 5MB</span>
              <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
            </label>
          )}

          {displayImage && (
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-50 text-gray-600 hover:bg-gray-100 cursor-pointer transition">
              <Upload className="w-3 h-3" />
              Change Photo
              <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
            </label>
          )}
          {errors.hospital_image && <p className="text-xs text-red-500 mt-1">{errors.hospital_image}</p>}
        </div>

        {/* About Us Content */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-primary-700 uppercase tracking-wider">
            About Us Page
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Hero Tagline</label>
            <input
              type="text"
              name="hero_tagline"
              value={form.hero_tagline}
              onChange={handleChange}
              placeholder="e.g. Where Care Meets Compassion"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Our Story</label>
            <textarea
              name="about_story"
              value={form.about_story}
              onChange={handleChange}
              placeholder="Tell visitors about your hospital's journey and mission..."
              rows={5}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none"
            />
          </div>
        </div>

        {/* Vision */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-primary-700 uppercase tracking-wider">
            Vision & Mission Page
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Vision Statement
            </label>
            <textarea
              name="vision_statement"
              value={form.vision_statement}
              onChange={handleChange}
              placeholder="Your hospital's vision — shown as a prominent quote on the Vision page"
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none"
            />
          </div>
        </div>

        {/* Contact Details */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-primary-700 uppercase tracking-wider">
            Contact Details
          </h2>
          <p className="text-xs text-gray-400">
            These appear on the Contact Us page and in the footer.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91-98765-43210"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Emergency Phone</label>
              <input
                type="text"
                name="emergency_phone"
                value={form.emergency_phone}
                onChange={handleChange}
                placeholder="+91-98765-43211"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="info@swarnahospitals.com"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Working Hours</label>
              <input
                type="text"
                name="working_hours"
                value={form.working_hours}
                onChange={handleChange}
                placeholder="Mon–Sat: 8 AM – 9 PM | Sun: 9 AM – 1 PM"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Full hospital address"
              rows={2}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none"
            />
          </div>
        </div>

        {/* General error */}
        {errors.detail && (
          <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {errors.detail}
          </div>
        )}

        {/* Save button */}
        <div className="sticky bottom-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-semibold py-3 px-8 rounded-xl transition-colors shadow-lg"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
