import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="auth-page">
      <div className="auth-card card" data-aos="zoom-in" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 56 }}>🔌</div>
        <h1>404</h1>
        <p className="muted">الصفحة اللي بتدور عليها غير موجودة.</p>
        <Link to="/" className="btn primary" style={{ marginTop: 14 }}>الرجوع للرئيسية</Link>
      </div>
    </section>
  );
}
