import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import * as api from '../api/mockApi';
import { formatTime, timeAgo } from '../utils/format';
import { Pill, statusPill, Loader } from '../components/ui';
import axios from "axios"
export default function Home() {
  const [areas, setAreas] = useState([]);
  const [selected, setSelected] = useState('kalakla');
  const [applied, setApplied] = useState('kalakla');
  const [data, setData] = useState(null);
  const [complaints, setComplaints] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
  .get("localhost:8080/locations")
  .then((response) => {
    setAreas(response.data.data)
  })
  .catch((error) => {
    setError(error.message)
  })
  }, []);

  useEffect(() => {
    let cancelled = false;
    setError('');
    api
      .getAreaOverview(applied)
      .then((d) => !cancelled && setData(d))
      .catch((e) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };

     axios
    .get(`localhost:8080/locations/${applied}`)
    .then((response) => {
    !cancelled && setData(response.data.data)
     })
    .catch((error) => {
    !cancelled && setError(e.message)
      })
  }, [applied]);

  useEffect(() => {

    let cancelled = false;
    setError('');
     axios
    .get(`localhost:8080/locations/${applied}/complaints`)
    .then((response) => {
    !cancelled && setComplaints(response.data.data)
     })
    .catch((error) => {
    !cancelled && setError(error.message)
      })
  }, [applied]);

  useEffect(() => {
    if (data) setTimeout(() => AOS.refresh(), 50);
  }, [data]);

  const first = data?.schedules[0];
  const actual = data?.actual;

  return (
    <>
      <section className="hero">
        <div className="shell hero-grid">
          <div data-aos="fade-up">
            <div className="eyebrow">منصة متابعة الكهرباء المجتمعية</div>
            <h1>الكهرباء قاطعة؟<br />خلّيك عارف الحاصل.</h1>
            <p>
              اختار منطقتك وشوف جدول القطوعات المتوقع، والحالة الفعلية حسب آخر تحديثات المواطنين. قارن بين المخطط
              والواقع قبل ما ترتب يومك.
            </p>
            <div className="searchbox">
              <select value={selected} onChange={(e) => setSelected(e.target.value)} aria-label="اختر المنطقة">
                {areas.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
              <button className="btn primary" onClick={() => setApplied(selected)}>عرض حالة المنطقة ←</button>
            </div>
          </div>

          <div className="hero-art" data-aos="zoom-in" data-aos-delay="100">
            <div className="art-icon">⚡</div>
            <div className="art-big">صورة أوضح<br />لواقع الكهرباء</div>
            <br></br>
            <div className="art-status p-relative mt-4">
              <span><i className={`dot ${actual === 'قاطعة' ? 'red' : 'green'}`} />حالة المنطقة الآن</span>
              <b>{actual || '...'}</b>
            </div>
          </div>
        </div>
      </section>

      {error && <div className="shell section"><div className="notice">{error}</div></div>}
      {!data && !error && <div className="shell section"><Loader /></div>}

      {data && (
        <>
          <section className="section shell">
            <div className="section-head">
              <div>
                <div className="eyebrow">ملخص المنطقة</div>
                <h2>{data.area.city} — {data.area.name}</h2>
              </div>
              <span className="tagline">
                آخر تحديث: {data.lastUpdate ? timeAgo(data.lastUpdate) : 'لا توجد بلاغات'}
              </span>
            </div>

            <div className="stats">
              <div className="card stat" data-aos="fade-up">
                <div>
                  <div className="label">الحالة حسب البلاغات</div>
                  <strong>{actual}</strong>
                  <span className={`pill ${statusPill(actual)}`}>
                    {actual === 'شغالة' ? 'مستقرة حالياً' : 'انقطاع حسب البلاغات'}
                  </span>
                </div>
                <div className="stat-icon">⚡</div>
              </div>
              <div className="card stat" data-aos="fade-up" data-aos-delay="60">
                <div>
                  <div className="label">موعد القطع المتوقع</div>
                  <strong>{formatTime(first?.cut)}</strong>
                  <span className="tagline">حسب جدول البرمجة</span>
                </div>
                <div className="stat-icon">◷</div>
              </div>
              <div className="card stat" data-aos="fade-up" data-aos-delay="120">
                <div>
                  <div className="label">موعد العودة المتوقع</div>
                  <strong>{formatTime(first?.back)}</strong>
                  <span className="tagline">حسب جدول البرمجة</span>
                </div>
                <div className="stat-icon">↗</div>
              </div>
              <div className="card stat" data-aos="fade-up" data-aos-delay="180">
                <div>
                  <div className="label">بلاغات اليوم</div>
                  <strong>{data.todayCount}</strong>
                  <span className="tagline">من سكان المنطقة</span>
                </div>
                <div className="stat-icon">▤</div>
              </div>
            </div>
          </section>

          <section className="section shell">
            <div className="grid-main">
              {/* <div className="card" data-aos="fade-up">
                <div className="section-head">
                  <div>
                    <div className="eyebrow">Expected schedule</div>
                    <h2>جدول البرمجة المتوقع</h2>
                  </div>
                  <span className="pill pill-amber">جدول تجريبي</span>
                </div>

                {data.schedules.length === 0 && <p className="muted">لا يوجد جدول لهذه المنطقة بعد.</p>}
                {data.schedules.map((s, i) => (
                  <div className="schedule-row" key={s.id}>
                    <div>
                      <b>{['الفترة الأولى', 'الفترة الثانية', 'الفترة الثالثة'][i] || `الفترة ${i + 1}`}</b>
                      <div className="tagline">{s.day}</div>
                    </div>
                    <div><small className="muted">القطع</small><div className="time">{formatTime(s.cut)}</div></div>
                    <div><small className="muted">العودة</small><div className="time">{formatTime(s.back)}</div></div>
                    <span className="pill pill-amber">متوقع</span>
                  </div>
                ))}

                <div className="compare">
                  <div className="compare-box">
                    <small>المتوقع حسب الجدول</small>
                    <strong>{formatTime(first?.cut)}</strong>
                    <span className="tagline">موعد القطع</span>
                  </div>
                  <div className="compare-box">
                    <small>الحالة الفعلية الآن</small>
                    <strong>{actual}</strong>
                    <span className="tagline">حسب بلاغات المجتمع</span>
                  </div>
                </div>
                <div className="notice">
                  تنبيه: الجدول المعروض تجريبي لأغراض التحدي، وقد تتغير الحالة الفعلية بسبب الأعطال أو التحديثات الميدانية.
                </div>
              </div> */}

              <div className="card" data-aos="fade-up" data-aos-delay="100">
                <div className="section-head">
                  <div>
                    <div className="eyebrow">Community updates</div>
                    <h2>آخر بلاغات المواطنين</h2>
                  </div>
                  <span className="pill pill-green">مراجعة المجتمع</span>
                </div>
                <div className="reports">
                  {/* {complaints.length === 0 && <p className="muted">لا توجد بلاغات معتمدة بعد.</p>}
                  {complaints.slice(0, 5).map((r) => (
                    <div className="report" key={complaints.id}>
                      <div className="bubble">⚡</div>
                      <div style={{ flex: 1 }}>
                        <p>{complaints.text}</p>
                        <time>{timeAgo(complaints.createdAt)}</time>
                      </div>
                      <Pill status={complaints.state} />
                    </div>
                  ))} */}
                </div>
              </div>
            </div>

            <div className="cta" data-aos="fade-up">
              <div>
                <h3>حالة منطقتك مختلفة عن المعروض؟</h3>
                <p>ساهم بتحديث الحالة عشان تساعد جيرانك بمعلومة أقرب للواقع.</p>
              </div>
              <Link to="/report" className="btn">أرسل بلاغ الآن ←</Link>
            </div>
          </section>
        </>
      )}
    </>
  );
}
