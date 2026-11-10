import { NavLink, Outlet, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const titles = {
  '/admin': 'نظرة عامة',
  '/admin/reports': 'إدارة البلاغات',
  '/admin/schedules': 'جداول البرمجة',
  '/admin/users': 'المستخدمون',
};

export default function AdminLayout() {
  const { pathname } = useLocation();

  return (
    <>
      <Navbar />
      <div className="shell admin-wrap">
        <aside className="sidebar">
          <div className="side-title">⚡ إدارة المنصة</div>
          <NavLink to="/admin" end className="side-btn">▦ نظرة عامة</NavLink>
          <NavLink to="/admin/reports" className="side-btn">▤ إدارة البلاغات</NavLink>
          <NavLink to="/admin/schedules" className="side-btn">◷ جداول البرمجة</NavLink>
          <NavLink to="/admin/users" className="side-btn">♙ المستخدمون</NavLink>
        </aside>

        <section className="admin-content">
          <div className="admin-head">
            <div>
              <div className="eyebrow">ADMIN CONTROL PANEL</div>
              <h1>{titles[pathname] || 'لوحة الأدمن'}</h1>
            </div>
            <span className="pill pill-green">النظام يعمل</span>
          </div>
          <Outlet />
        </section>
      </div>
    </>
  );
}
