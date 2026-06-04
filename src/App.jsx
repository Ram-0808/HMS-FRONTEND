import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import AboutUs from './pages/public/AboutUs';
import WhoWeAre from './pages/public/WhoWeAre';
import Services from './pages/public/Services';
import VisionMission from './pages/public/VisionMission';
import ContactUs from './pages/public/ContactUs';

// Admin pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import PatientList from './pages/admin/PatientList';
import PatientForm from './pages/admin/PatientForm';
import DoctorList from './pages/admin/DoctorList';
import DoctorForm from './pages/admin/DoctorForm';
import Gallery from './pages/admin/Gallery';
import SiteSettings from './pages/admin/SiteSettings';

export default function App() {
  return (
    <Routes>
      {/* Public Client Portal */}
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/about" replace />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/who-we-are" element={<WhoWeAre />} />
        <Route path="/services" element={<Services />} />
        <Route path="/vision-mission" element={<VisionMission />} />
        <Route path="/contact" element={<ContactUs />} />
      </Route>

      {/* Admin Login (no layout) */}
      <Route path="/admin/login" element={<Login />} />

      {/* Admin Portal (protected) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="patients" element={<PatientList />} />
        <Route path="patients/new" element={<PatientForm />} />
        <Route path="patients/:id/edit" element={<PatientForm />} />
        <Route path="doctors" element={<DoctorList />} />
        <Route path="doctors/new" element={<DoctorForm />} />
        <Route path="doctors/:id/edit" element={<DoctorForm />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="settings" element={<SiteSettings />} />
      </Route>
    </Routes>
  );
}
