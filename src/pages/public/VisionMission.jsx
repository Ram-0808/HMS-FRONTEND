import { Heart, Target, Eye, Lightbulb, Handshake, ShieldCheck, Sparkles } from 'lucide-react';
import useSiteSettings from '../../utils/useSiteSettings';

const MISSION_POINTS = [
  {
    icon: Heart,
    title: 'Patient-Centered Care',
    text: 'Place patients at the heart of every decision, ensuring personalized and compassionate treatment.',
  },
  {
    icon: Lightbulb,
    title: 'Medical Innovation',
    text: 'Continuously adopt the latest medical technologies and evidence-based practices for better outcomes.',
  },
  {
    icon: Handshake,
    title: 'Community Health',
    text: 'Actively engage with the community through health camps, awareness programs, and preventive care initiatives.',
  },
  {
    icon: ShieldCheck,
    title: 'Affordable Excellence',
    text: 'Deliver world-class healthcare at affordable costs, ensuring no one is denied quality treatment.',
  },
  {
    icon: Sparkles,
    title: 'Continuous Learning',
    text: 'Invest in our medical team\'s growth through training, research, and collaboration with leading institutions.',
  },
];

const CORE_VALUES = [
  'Trust', 'Excellence', 'Innovation', 'Compassion', 'Integrity', 'Accessibility',
];

const DEFAULT_VISION = 'To be the most trusted healthcare institution in the region — recognized for clinical excellence, compassionate care, and transformative impact on community health.';

export default function VisionMission() {
  const { settings } = useSiteSettings();

  const visionStatement = settings.vision_statement || DEFAULT_VISION;

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            Vision & Mission
          </h1>
          <p className="text-primary-100 text-lg max-w-xl mx-auto">
            The guiding principles that drive our commitment to healthier communities.
          </p>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L35 15 L30 25 L25 15Z' fill='%230d9488'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }} />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full mb-8">
            <Eye className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-semibold text-primary-700 uppercase tracking-wider">Our Vision</span>
          </div>

          <blockquote className="font-heading text-2xl md:text-3xl lg:text-4xl font-medium text-gray-900 leading-relaxed italic mb-8">
            "{visionStatement}"
          </blockquote>

          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            We envision a future where every individual has access to quality healthcare,
            where prevention is prioritized alongside treatment, and where Swarna Hospitals
            stands as a beacon of hope and healing.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full mb-4">
              <Target className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-semibold text-primary-700 uppercase tracking-wider">Our Mission</span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              What Drives Us Every Day
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Our mission is built on five pillars that guide every action we take
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {MISSION_POINTS.map(({ icon: Icon, title, text }, idx) => (
              <div
                key={title}
                className="animate-fade-in-up bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <span className="text-xs font-bold text-primary-300 uppercase tracking-widest">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values Banner */}
      <section className="py-10 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h3 className="font-heading text-xl font-semibold text-white">Our Core Values</h3>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            {CORE_VALUES.map((value, idx) => (
              <div key={value} className="flex items-center gap-4 md:gap-6">
                <span className="text-white font-semibold text-sm md:text-base tracking-wide">
                  {value}
                </span>
                {idx < CORE_VALUES.length - 1 && (
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
