import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (user) return <Navigate to="/" replace />;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const u = await login(form);
      toast(`أهلاً ${u.name}`);
      navigate(location.state?.from || (u.role === 'admin' ? '/admin' : '/'), { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillAdmin = () => setForm({ email: 'admin@example.com', password: 'admin123' });

  return (
    <section className="auth-page">
      <div className="auth-card card" data-aos="zoom-in">
        <div className="logo auth-logo">⚡</div>
        <h1>تسجيل الدخول</h1>
        <p className="muted">ادخل لحسابك عشان تتابع بلاغاتك.</p>

        <form onSubmit={submit} className="auth-form">
          <div className="field">
            <label>البريد الإلكتروني</label>
            <input type="email" value={form.email} onChange={set('email')} placeholder="name@example.com" required autoComplete="email" dir="ltr" />
          </div>
          <div className="field">
            <label>كلمة المرور</label>
            <input type="password" value={form.password} onChange={set('password')} placeholder="••••••••" required autoComplete="current-password" dir="ltr" />
          </div>
          {error && <div className="error-msg">{error}</div>}
          <button className="btn primary" type="submit" disabled={loading}>
            {loading ? 'جاري الدخول...' : 'دخول ←'}
          </button>
        </form>

        <div className="demo-hint">
          <span>حساب تجريبي للأدمن:</span>
          <button type="button" className="mini soft" onClick={fillAdmin}>تعبئة تلقائية</button>
        </div>

        <p className="auth-switch">
          ما عندك حساب؟ <Link to="/register" className="link">أنشئ حساباً جديداً</Link>
        </p>
      </div>
    </section>
  );
}
