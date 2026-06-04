import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, AlertTriangle, Send, CheckCircle } from 'lucide-react';
import useSiteSettings from '../../utils/useSiteSettings';

export default function ContactUs() {
  const { settings } = useSiteSettings();
  const [submitted, setSubmitted] = useState(false);

  const CONTACT_ITEMS = [
    { icon: MapPin, label: 'Address', value: settings.address },
    { icon: Phone, label: 'Phone', value: settings.phone },
    { icon: Phone, label: 'Emergency', value: settings.emergency_phone },
    { icon: Mail, label: 'Email', value: settings.email },
    { icon: Clock, label: 'Working Hours', value: settings.working_hours },
  ].filter((item) => item.value); // Only show items that have a value

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    e.target.reset();
  };

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            Contact Us
          </h1>
          <p className="text-primary-100 text-lg max-w-xl mx-auto">
            Get in touch with us for appointments, enquiries, or any assistance you need.
          </p>
        </div>
      </section>

      {/* Emergency Banner */}
      <section className="bg-red-50 border-b border-red-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-center gap-2 text-red-700">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <p className="text-sm font-medium">
            For emergencies, call <strong>108</strong> or our 24/7 helpline: <strong>{settings.emergency_phone}</strong>
          </p>
        </div>
      </section>

      {/* Contact Details + Map Placeholder */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Left: Contact details */}
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                Get In Touch
              </h2>
              <div className="space-y-5">
                {CONTACT_ITEMS.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                        {label}
                      </p>
                      <p className="text-gray-700 text-sm leading-relaxed">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Map placeholder */}
            <div className="bg-gray-100 rounded-2xl flex items-center justify-center h-72 md:h-80 border-2 border-dashed border-gray-200">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-400 font-medium">Google Maps</p>
                <p className="text-xs text-gray-300 mt-1">Will be embedded here</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Send Us a Message
            </h2>
            <p className="text-gray-500">
              Have a question? Fill out the form and we'll get back to you.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-5"
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                <input
                  type="tel"
                  placeholder="Your phone number"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                required
                placeholder="your@email.com"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
              <textarea
                rows={4}
                required
                placeholder="How can we help you?"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
              Send Message
            </button>

            {submitted && (
              <div className="flex items-center gap-2 text-green-600 text-sm justify-center animate-fade-in-up">
                <CheckCircle className="w-4 h-4" />
                Thank you! We'll get back to you soon.
              </div>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
