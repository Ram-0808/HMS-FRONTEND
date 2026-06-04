import { useState, useEffect } from 'react';
import { User, Stethoscope, HeartPulse, Bone, Baby, Brain, Eye, Ear } from 'lucide-react';
import { DOCTORS, SERVICES } from '../../utils/constants';
import API from '../../services/api';

const SERVICE_ICONS = [
  HeartPulse, Bone, Baby, Stethoscope, Brain, Eye, Ear, Stethoscope,
];

export default function WhoWeAre() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const { data } = await API.get('/doctors/');
        const list = data.results || data;
        // Only show doctors that have been added via admin
        if (list.length > 0) {
          setDoctors(list);
        }
        // If no doctors in DB yet, fall through to placeholder data
      } catch {
        // API not available — use placeholder data
      } finally {
        setLoading(false);
      }
    }
    fetchDoctors();
  }, []);

  // Use API data if available, otherwise fall back to hardcoded placeholders
  const displayDoctors = doctors.length > 0 ? doctors : DOCTORS;

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            Our Medical Team
          </h1>
          <p className="text-primary-100 text-lg max-w-xl mx-auto">
            Meet the experienced doctors and specialists dedicated to your health and well-being.
          </p>
        </div>
      </section>

      {/* Doctor Cards */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
              {displayDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="animate-fade-in-up bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  {/* Photo */}
                  <div className="bg-primary-50 h-52 flex items-center justify-center relative overflow-hidden">
                    {doctor.photo ? (
                      <img
                        src={doctor.photo}
                        alt={doctor.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <User className="w-10 h-10 text-primary-400" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="font-heading text-xl font-semibold text-gray-900 mb-1">
                      {doctor.name}
                    </h3>
                    <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full mb-2">
                      {doctor.specialty}
                    </span>
                    <p className="text-sm text-gray-400 mb-3">{doctor.qualification}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{doctor.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Services */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Services We Offer
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Comprehensive healthcare services under one roof
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SERVICES.map((service, idx) => {
              const Icon = SERVICE_ICONS[idx] || Stethoscope;
              return (
                <div
                  key={service.name}
                  className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-md hover:border-primary-200 transition-all duration-300"
                >
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
                  <p className="text-sm text-gray-500">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
