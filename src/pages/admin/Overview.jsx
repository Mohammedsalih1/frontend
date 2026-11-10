import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../../api/mockApi';
import { timeAgo } from '../../utils/format';
import { Loader, ReviewPill } from '../../components/ui';

export default function Overview() {
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState(null);

  const load = useCallback(async () => {
    const [s, p] = await Promise.all([api.getAdminStats(), api.getAdminReports('pending')]);
    setStats(s);
    setPending(p.slice(0, 3));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (!stats) return <Loader />;

  const items = [
    ['إجمالي البلاغات', stats.reports, 'هذا الأسبوع', '▤'],
    ['بانتظار المراجعة', stats.pending, null, '◷'],
    ['المستخدمون', stats.users, 'حساب مسجل', '♙'],
    ['المناطق المغطاة', stats.areas, 'منطقة', '⌖'],
  ];

  return (
    <>
      <div className="stats">
        {items.map(([label, value, hint, icon], i) => (
          <div className="card stat" key={label} data-aos="fade-up" data-aos-delay={i * 60}>
            <div>
              <div className="label">{label}</div>
              <strong>{String(value).padStart(2, '0')}</strong>
              {hint ? <span className="tagline">{hint}</span> : <span className="pill pill-amber">تحتاج إجراء</span>}
            </div>
            <div className="stat-icon">{icon}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 17 }} data-aos="fade-up">
        <div className="section-head">
          <div>
            <h2>بلاغات تحتاج مراجعة</h2>
            <span className="tagline">راجع صحة البلاغ قبل اعتماده</span>
          </div>
          <Link to="/admin/reports" className="btn soft">عرض الكل</Link>
        </div>
        <div className="reports">
          {pending.length === 0 && <p className="muted">لا توجد بلاغات معلّقة 🎉</p>}
          {pending.map((r) => (
            <div className="report" key={r.id}>
              <div className="bubble">⚡</div>
              <div style={{ flex: 1 }}>
                <b>{r.areaLabel}</b>
                <p>{r.desc}</p>
                <time>{timeAgo(r.createdAt)}</time>
              </div>
              <ReviewPill review={r.review} />
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginTop: 17 }} data-aos="fade-up">
        <h2 style={{ fontSize: 18, color: 'var(--navy)' }}>فكرة مهمة لإدارة موثوقية البيانات</h2>
        <p className="muted" style={{ lineHeight: 1.9, fontSize: 14 }}>
          لا تجعل البلاغ المجتمعي يغيّر جدول البرمجة الرسمي. احتفظ بمصدر كل معلومة: الجدول من الإدارة، والحالة من بلاغات
          المواطنين، ثم اعرض الفرق بينهما بوضوح.
        </p>
      </div>
    </>
  );
}
