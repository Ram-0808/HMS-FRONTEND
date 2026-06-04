import { useState, useEffect } from 'react';
import API from '../services/api';
import { HOSPITAL_INFO } from './constants';

/**
 * Hook to fetch site settings from the API.
 * Falls back to hardcoded constants if API is unavailable or fields are empty.
 */
export default function useSiteSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data } = await API.get('/settings/');
        setSettings(data);
      } catch {
        // API unavailable — use defaults
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  // Merge API settings with defaults — API values take priority when non-empty
  const merged = {
    hospital_image: settings?.hospital_image || null,
    hero_tagline: settings?.hero_tagline || HOSPITAL_INFO.tagline,
    about_story: settings?.about_story || '',
    vision_statement: settings?.vision_statement || '',
    phone: settings?.phone || HOSPITAL_INFO.phone,
    emergency_phone: settings?.emergency_phone || HOSPITAL_INFO.emergency,
    email: settings?.email || HOSPITAL_INFO.email,
    address: settings?.address || HOSPITAL_INFO.address,
    working_hours: settings?.working_hours || HOSPITAL_INFO.hours,
    hospital_name: HOSPITAL_INFO.name,
    emergencyHours: HOSPITAL_INFO.emergencyHours,
  };

  return { settings: merged, loading };
}
