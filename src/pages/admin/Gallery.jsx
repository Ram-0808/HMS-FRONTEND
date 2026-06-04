import { useState, useEffect } from 'react';
import { Upload, Trash2, GripVertical, ImageIcon, X, ArrowUp, ArrowDown } from 'lucide-react';
import API from '../../services/api';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/gallery/');
      setImages(data.results || data);
    } catch {
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    let successCount = 0;

    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;
      if (file.size > 5 * 1024 * 1024) continue;

      const formData = new FormData();
      formData.append('image', file);
      formData.append('caption', '');
      formData.append('order', images.length + successCount);
      formData.append('is_active', true);

      try {
        await API.post('/gallery/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        successCount++;
      } catch {
        // Skip failed uploads
      }
    }

    if (successCount > 0) fetchGallery();
    setUploading(false);
    e.target.value = ''; // Reset file input
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image from the gallery?')) return;
    try {
      await API.delete(`/gallery/${id}/`);
      setImages((prev) => prev.filter((img) => img.id !== id));
    } catch {
      alert('Failed to delete. Please try again.');
    }
  };

  const handleCaptionUpdate = async (id, caption) => {
    try {
      await API.patch(`/gallery/${id}/`, { caption });
    } catch {
      // Silent fail for caption updates
    }
  };

  const handleToggleActive = async (id, isActive) => {
    try {
      await API.patch(`/gallery/${id}/`, { is_active: !isActive });
      fetchGallery();
    } catch {
      alert('Failed to update. Please try again.');
    }
  };

  const handleMoveUp = async (index) => {
    if (index === 0) return;
    const newImages = [...images];
    [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];

    // Update order for both
    try {
      await API.patch(`/gallery/${newImages[index - 1].id}/`, { order: index - 1 });
      await API.patch(`/gallery/${newImages[index].id}/`, { order: index });
      setImages(newImages);
    } catch {
      fetchGallery();
    }
  };

  const handleMoveDown = async (index) => {
    if (index === images.length - 1) return;
    const newImages = [...images];
    [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];

    try {
      await API.patch(`/gallery/${newImages[index].id}/`, { order: index });
      await API.patch(`/gallery/${newImages[index + 1].id}/`, { order: index + 1 });
      setImages(newImages);
    } catch {
      fetchGallery();
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Gallery</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage photos for the Services page carousel
          </p>
        </div>
        <label className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors cursor-pointer">
          <Upload className="w-4 h-4" />
          {uploading ? 'Uploading...' : 'Upload Photos'}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {/* Upload hint */}
      <div className="bg-primary-50 rounded-xl p-4 mb-6 flex items-start gap-3">
        <ImageIcon className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
        <div className="text-sm text-primary-700">
          <p className="font-medium">Tips for great gallery photos:</p>
          <p className="text-primary-600 mt-0.5">
            Use landscape photos for best results. Recommended size: 1200×600px or larger.
            You can upload multiple photos at once. Drag to reorder.
          </p>
        </div>
      </div>

      {/* Gallery grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full" />
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <ImageIcon className="w-14 h-14 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No gallery photos yet</p>
          <p className="text-sm text-gray-300 mt-1">Upload photos to display them in the carousel</p>
        </div>
      ) : (
        <div className="space-y-3">
          {images.map((img, index) => (
            <div
              key={img.id}
              className={`bg-white rounded-xl border border-gray-200 overflow-hidden flex items-stretch hover:shadow-md transition-shadow ${
                !img.is_active ? 'opacity-60' : ''
              }`}
            >
              {/* Thumbnail */}
              <div className="w-40 h-28 shrink-0">
                <img
                  src={img.image}
                  alt={img.caption || ''}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info + actions */}
              <div className="flex-1 p-4 flex items-center gap-4">
                {/* Reorder buttons */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    title="Move up"
                  >
                    <ArrowUp className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => handleMoveDown(index)}
                    disabled={index === images.length - 1}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    title="Move down"
                  >
                    <ArrowDown className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                {/* Caption input */}
                <div className="flex-1">
                  <input
                    type="text"
                    defaultValue={img.caption}
                    onBlur={(e) => handleCaptionUpdate(img.id, e.target.value)}
                    placeholder="Add a caption..."
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Position: {index + 1} of {images.length}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(img.id, img.is_active)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      img.is_active
                        ? 'bg-green-50 text-green-700 hover:bg-green-100'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {img.is_active ? 'Visible' : 'Hidden'}
                  </button>
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
