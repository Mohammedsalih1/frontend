import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as api from '../api/mockApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Report() {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [areas, setAreas] = useState([]);
  const [form, setForm] = useState({ areaId: 'kalakla', place: '', status: 'قاطعة', desc: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getAreas().then(setAreas);
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.createReport(form);
      toast('تم إرسال البلاغ بنجاح — بانتظار المراجعة');
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section shell" style={{ paddingTop: 45 }}>
      <div style={{ maxWidth: 760, margin: 'auto' }}>
        <div className="eyebrow" data-aos="fade-up">Community report</div>
        <h1 style={{ color: 'var(--navy)', margin: '8px 0' }} data-aos="fade-up">شاركنا حالة الكهرباء</h1>
        <p className="muted" style={{ lineHeight: 1.8 }} data-aos="fade-up">
          بلاغك بيساعد بقية المواطنين يعرفوا الحالة الفعلية. اختر المنطقة وحدد الحالة واكتب وصفاً مختصراً.
        </p>

        <div className="card" style={{ marginTop: 22 }} data-aos="fade-up" data-aos-delay="80">
          <form onSubmit={submit} className="form-grid">
            <div className="field">
              <label>المنطقة</label>
              <select value={form.areaId} onChange={set('areaId')} required>
                {areas.map((a) => <option key={a.id} value={a.id}>{a.city} — {a.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label>الحي / الموقع (اختياري)</label>
              <input value={form.place} onChange={set('place')} placeholder="مثلاً: القبة" maxLength={40} />
            </div>
            <div className="field full">
              <label>حالة الكهرباء</label>
              <select value={form.status} onChange={set('status')} required>
                <option value="قاطعة">قاطعة</option>
                <option value="شغالة">شغالة</option>
              </select>
            </div>
            <div className="field full">
              <label>وصف بسيط للحاصل</label>
              <textarea
                value={form.desc}
                onChange={set('desc')}
                maxLength={240}
                placeholder="مثلاً: الكهرباء قاطعة من الساعة 5 مساءً..."
                required
              />
              <small className="tagline">{form.desc.length}/240 حرفاً</small>
            </div>

            {error && <div className="full error-msg">{error}</div>}

            <div className="full form-foot">
              <span className="tagline">
                {user ? `سيُرسل البلاغ باسم ${user.name}` : <>لا تحتاج حساباً لإرسال البلاغ، أو <Link to="/login" className="link">سجّل دخولك</Link>.</>}
              </span>
              <button className="btn primary" type="submit" disabled={loading}>
                {loading ? 'جاري الإرسال...' : 'إرسال البلاغ ←'}
              </button>
            </div>
          </form>
        </div>

        <div className="notice">
          ملاحظة: البلاغات المجتمعية لا تُعد تأكيداً رسمياً. قد يراجع الأدمن البلاغ قبل ظهوره ضمن التحديثات المعتمدة.
        </div>
      </div>
    </section>
  );
}
