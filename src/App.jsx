import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

import PublicLayout from './components/PublicLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Report from './pages/Report';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import AdminLayout from './pages/admin/AdminLayout';
import Overview from './pages/admin/Overview';
import AdminReports from './pages/admin/AdminReports';
import AdminSchedules from './pages/admin/AdminSchedules';
import AdminUsers from './pages/admin/AdminUsers';

export default function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    AOS.init({ duration: 750, once: true, offset: 55 });
  }, []);

  // عند كل تنقل: ارجع لأعلى الصفحة وحدّث الأنميشن
  useEffect(() => {
    window.scrollTo({ top: 0 });
    const t = setTimeout(() => AOS.refreshHard(), 60);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<Report />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="schedules" element={<AdminSchedules />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>
    </Routes>
  );
}
