import {
  HeartPulse,
  Shield,
  Users,
  Award,
  Building2,
  Microscope,
  BedDouble,
  FlaskConical,
} from 'lucide-react';
import useSiteSettings from '../../utils/useSiteSettings';

const VALUES = [
  {
    icon: HeartPulse,
    title: 'Compassionate Care',
    text: 'Every patient is treated with empathy, dignity, and genuine concern for their well-being.',
  },
  {
    icon: Shield,
    title: 'Trust & Safety',
    text: 'We uphold the highest standards of patient safety and transparent medical practices.',
  },
  {
    icon: Users,
    title: 'Expert Team',
    text: 'Our doctors and staff bring decades of combined experience across multiple specialties.',
  },
  {
    icon: Award,
    title: 'Clinical Excellence',
    text: 'We are committed to continuous improvement and adopting the latest medical advancements.',
  },
];

const FACILITIES = [
  { icon: Building2, label: 'Modern Infrastructure', desc: 'Spacious, well-equipped facility' },
  { icon: Microscope, label: 'Advanced Diagnostics', desc: 'State-of-the-art lab and imaging' },
  { icon: BedDouble, label: 'Comfortable Wards', desc: 'Clean, comfortable patient rooms' },
  { icon: FlaskConical, label: 'In-house Pharmacy', desc: 'Fully stocked pharmacy on premises' },
];

const DEFAULT_STORY = `Swarna Hospitals was founded with a singular vision — to make quality healthcare accessible, affordable, and compassionate for every family in our community.

What started as a small clinic has grown into a multi-specialty hospital equipped with modern diagnostic facilities, comfortable patient wards, and a dedicated team of experienced medical professionals.

Our in-house pharmacy ensures patients receive their prescribed medications without delay, and our staff is committed to making every visit as comfortable and stress-free as possible.`;

export default function AboutUs() {
  const { settings, loading } = useSiteSettings();

  // Split story text into paragraphs
  const storyText = settings.about_story || DEFAULT_STORY;
  const storyParagraphs = storyText.split('\n').filter((p) => p.trim());

  return (
    <div className="animate-fade-in-up">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ij48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYtMmgtNHY2aDR2LTJtMC04aC0ydjRoMnYtNHptLTggMGgtMnY0aDJ2LTR6bTAgOGgtMnY0aDJ2LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight">
            Welcome to {settings.hospital_name}
          </h1>
          <p className="text-primary-100 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            {settings.hero_tagline} — your trusted partner in health and wellness,
            serving the community with dedication and excellence.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Story text */}
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                {storyParagraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </div>

            {/* Right: Hospital image or placeholder */}
            <div className="rounded-2xl overflow-hidden h-72 md:h-80">
              {settings.hospital_image ? (
                <img
                  src={settings.hospital_image}
                  alt="Swarna Hospitals Building"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="bg-primary-50 rounded-2xl flex items-center justify-center h-full border-2 border-dashed border-primary-200">
                  <div className="text-center">
                    <Building2 className="w-16 h-16 text-primary-300 mx-auto mb-3" />
                    <p className="text-sm text-primary-400 font-medium">Hospital Building Photo</p>
                    <p className="text-xs text-primary-300 mt-1">Upload via Admin → Settings</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Our Core Values
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              The principles that guide everything we do at Swarna Hospitals
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Our Facilities
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Modern infrastructure designed for your comfort and care
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {FACILITIES.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="animate-fade-in-up bg-gradient-to-br from-primary-50 to-white rounded-xl p-6 text-center border border-primary-100"
              >
                <Icon className="w-10 h-10 text-primary-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">{label}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
