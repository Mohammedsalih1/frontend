import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const onLogout = async () => {
    await logout();
    toast('تم تسجيل الخروج');
    navigate('/');
  };

  return (
    <header className="topbar">
      <div className="shell nav">
        <Link to="/" className="brand">
          <div className="logo">⚡</div>
          <div>
            وين الكهرباء؟
            <div className="tagline">معلومة أوضح.. قرار أفضل</div>
          </div>
        </Link>

        <nav className="navlinks">
          <NavLink to="/" end>الرئيسية</NavLink>
          <NavLink to="/report">إرسال بلاغ</NavLink>
          {isAdmin && <NavLink to="/admin">لوحة الأدمن</NavLink>}
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <span className="user-chip" title={user.email}>👤 {user.name}</span>
              <button className="btn outline" onClick={onLogout}>خروج</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn outline">دخول</Link>
              <Link to="/register" className="btn primary">حساب جديد</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
