import { useCallback, useEffect, useState } from 'react';
import * as api from '../../api/mockApi';
import { useToast } from '../../context/ToastContext';
import { formatTime } from '../../utils/format';
import { Loader, Modal } from '../../components/ui';

const empty = { areaId: 'kalakla', day: 'اليوم', cut: '', back: '' };

export default function AdminSchedules() {
  const toast = useToast();
  const [rows, setRows] = useState(null);
  const [areas, setAreas] = useState([]);
  const [editing, setEditing] = useState(null); // null = مغلق
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => setRows(await api.getSchedules()), []);

  useEffect(() => {
    load();
    api.getAreas().then(setAreas);
  }, [load]);

  const set = (k) => (e) => setEditing((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.saveSchedule(editing);
      toast(editing.id ? 'تم تعديل الجدول' : 'تمت إضافة الجدول');
      setEditing(null);
      load();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('حذف هذا الجدول؟')) return;
    await api.deleteSchedule(id);
    toast('تم حذف الجدول');
    load();
  };

  return (
    <div className="card" data-aos="fade-up">
      <div className="section-head">
        <div>
          <h2>جداول البرمجة</h2>
          <span className="tagline">إضافة وتعديل مواعيد القطع والعودة</span>
        </div>
        <button className="btn primary" onClick={() => setEditing(empty)}>+ إضافة جدول</button>
      </div>

      {!rows ? (
        <Loader />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>المنطقة</th><th>اليوم</th><th>موعد القطع</th><th>موعد العودة</th><th>الإجراءات</th></tr>
            </thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan="5">لا توجد جداول</td></tr>}
              {rows.map((s) => (
                <tr key={s.id}>
                  <td>{s.areaName}</td>
                  <td>{s.day}</td>
                  <td>{formatTime(s.cut)}</td>
                  <td>{formatTime(s.back)}</td>
                  <td>
                    <div className="actions">
                      <button className="mini soft" onClick={() => setEditing(s)}>تعديل</button>
                      <button className="mini danger" onClick={() => remove(s.id)}>حذف</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <Modal title={editing.id ? 'تعديل جدول برمجة' : 'إضافة جدول برمجة'} onClose={() => setEditing(null)}>
          <form onSubmit={submit} className="form-grid">
            <div className="field full">
              <label>المنطقة</label>
              <select value={editing.areaId} onChange={set('areaId')} required>
                {areas.map((a) => <option key={a.id} value={a.id}>{a.city} — {a.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label>موعد القطع</label>
              <input type="time" value={editing.cut} onChange={set('cut')} required />
            </div>
            <div className="field">
              <label>موعد العودة</label>
              <input type="time" value={editing.back} onChange={set('back')} required />
            </div>
            <div className="field full">
              <label>اليوم</label>
              <select value={editing.day} onChange={set('day')}>
                <option>اليوم</option>
                <option>غداً</option>
                <option>بعد غد</option>
              </select>
            </div>
            <div className="full">
              <button className="btn primary" type="submit" disabled={saving}>
                {saving ? 'جاري الحفظ...' : 'حفظ الجدول'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
