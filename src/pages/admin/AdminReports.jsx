import { useCallback, useEffect, useState } from 'react';
import * as api from '../../api/mockApi';
import { useToast } from '../../context/ToastContext';
import { timeAgo } from '../../utils/format';
import { Loader, Pill, ReviewPill } from '../../components/ui';

export default function AdminReports() {
  const toast = useToast();
  const [filter, setFilter] = useState('all');
  const [rows, setRows] = useState(null);

  const load = useCallback(async () => {
    setRows(await api.getAdminReports(filter));
  }, [filter]);

  useEffect(() => {
    setRows(null);
    load();
  }, [load]);

  const review = async (id, status) => {
    await api.setReportReview(id, status);
    toast(status === 'approved' ? 'تم اعتماد البلاغ' : 'تم رفض البلاغ');
    load();
  };

  return (
    <div className="card" data-aos="fade-up">
      <div className="section-head">
        <div>
          <h2>مراجعة البلاغات</h2>
          <span className="tagline">اعتماد البلاغ أو رفضه</span>
        </div>
        <select className="filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">كل البلاغات</option>
          <option value="pending">قيد المراجعة</option>
          <option value="approved">معتمدة</option>
          <option value="rejected">مرفوضة</option>
        </select>
      </div>

      {!rows ? (
        <Loader />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>المنطقة</th><th>الحالة</th><th>الوصف</th><th>الوقت</th><th>الحالة الإدارية</th><th>الإجراء</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan="6">لا توجد بلاغات</td></tr>}
              {rows.map((r) => (
                <tr key={r.id}>
                  <td><b>{r.areaLabel}</b></td>
                  <td><Pill status={r.status} /></td>
                  <td>{r.desc}</td>
                  <td>{timeAgo(r.createdAt)}</td>
                  <td><ReviewPill review={r.review} /></td>
                  <td>
                    {r.review === 'pending' ? (
                      <div className="actions">
                        <button className="mini soft" onClick={() => review(r.id, 'approved')}>اعتماد</button>
                        <button className="mini danger" onClick={() => review(r.id, 'rejected')}>رفض</button>
                      </div>
                    ) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
