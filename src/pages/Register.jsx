import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (user) return <Navigate to="/" replace />;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.name.trim().length < 3) return setError('الاسم لازم يكون 3 أحرف على الأقل');
    if (form.password.length < 6) return setError('كلمة المرور لازم تكون 6 أحرف على الأقل');
    if (form.password !== form.confirm) return setError('كلمتا المرور غير متطابقتين');

    setLoading(true);
    try {
      const u = await register({ name: form.name, email: form.email, password: form.password });
      toast(`تم إنشاء الحساب — أهلاً ${u.name}`);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card card" data-aos="zoom-in">
        <div className="logo auth-logo">⚡</div>
        <h1>إنشاء حساب</h1>
        <p className="muted">سجّل عشان تتابع بلاغاتك وتساهم مع مجتمعك.</p>

        <form onSubmit={submit} className="auth-form">
          <div className="field">
            <label>الاسم</label>
            <input value={form.name} onChange={set('name')} placeholder="الاسم الكامل" required autoComplete="name" />
          </div>
          <div className="field">
            <label>البريد الإلكتروني</label>
            <input type="email" value={form.email} onChange={set('email')} placeholder="name@example.com" required autoComplete="email" dir="ltr" />
          </div>
          <div className="field">
            <label>كلمة المرور</label>
            <input type="password" value={form.password} onChange={set('password')} placeholder="6 أحرف على الأقل" required autoComplete="new-password" dir="ltr" />
          </div>
          <div className="field">
            <label>تأكيد كلمة المرور</label>
            <input type="password" value={form.confirm} onChange={set('confirm')} placeholder="أعد كتابة كلمة المرور" required autoComplete="new-password" dir="ltr" />
          </div>
          {error && <div className="error-msg">{error}</div>}
          <button className="btn primary" type="submit" disabled={loading}>
            {loading ? 'جاري الإنشاء...' : 'إنشاء الحساب ←'}
          </button>
        </form>

        <p className="auth-switch">
          عندك حساب؟ <Link to="/login" className="link">سجّل الدخول</Link>
        </p>
      </div>
    </section>
  );
}
