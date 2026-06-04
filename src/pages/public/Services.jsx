import { useState, useEffect } from 'react';
import { Stethoscope, HeartPulse, Bone, Baby, Brain, Eye, Ear, ImageOff } from 'lucide-react';
import { SERVICES } from '../../utils/constants';
import ImageCarousel from '../../components/ImageCarousel';
import API from '../../services/api';

const SERVICE_ICONS = [
  HeartPulse, Bone, Baby, Stethoscope, Brain, Eye, Ear, Stethoscope,
];

export default function Services() {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const { data } = await API.get('/gallery/');
        setGalleryImages(data.results || data);
      } catch {
        // Gallery not available yet
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            Our Services
          </h1>
          <p className="text-primary-100 text-lg max-w-xl mx-auto">
            Comprehensive healthcare services and a glimpse into our world-class facilities.
          </p>
        </div>
      </section>

      {/* Photo Gallery Carousel */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Inside Swarna Hospitals
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              A look at our facilities, surgeries, and the care we provide every day
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full" />
            </div>
          ) : galleryImages.length > 0 ? (
            <ImageCarousel images={galleryImages} />
          ) : (
            <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center h-64 md:h-80">
              <ImageOff className="w-14 h-14 text-gray-300 mb-3" />
              <p className="text-sm text-gray-400 font-medium">Gallery photos will appear here</p>
              <p className="text-xs text-gray-300 mt-1">Upload via Admin → Gallery</p>
            </div>
          )}
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              What We Offer
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Multi-specialty healthcare services under one roof
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {SERVICES.map((service, idx) => {
              const Icon = SERVICE_ICONS[idx] || Stethoscope;
              return (
                <div
                  key={service.name}
                  className="animate-fade-in-up bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1.5">{service.name}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-3">
            Need to book an appointment?
          </h2>
          <p className="text-primary-100 mb-6 max-w-md mx-auto">
            Call us today or visit our hospital. We're here to help you feel better.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
}
