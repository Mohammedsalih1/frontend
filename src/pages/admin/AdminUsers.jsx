import { useCallback, useEffect, useState } from 'react';
import * as api from '../../api/mockApi';
import { useToast } from '../../context/ToastContext';
import { Loader } from '../../components/ui';

export default function AdminUsers() {
  const toast = useToast();
  const [rows, setRows] = useState(null);

  const load = useCallback(async () => setRows(await api.getUsers()), []);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = async (u) => {
    try {
      await api.toggleUserActive(u.id);
      toast(u.active ? 'تم إيقاف الحساب' : 'تم تفعيل الحساب');
      load();
    } catch (e) {
      toast(e.message);
    }
  };

  return (
    <div className="card" data-aos="fade-up">
      <div className="section-head">
        <div>
          <h2>المستخدمون</h2>
          <span className="tagline">إدارة الحسابات والصلاحيات</span>
        </div>
      </div>

      {!rows ? (
        <Loader />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>الاسم</th><th>البريد الإلكتروني</th><th>الدور</th><th>الحالة</th><th>الإجراء</th></tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td dir="ltr" style={{ textAlign: 'right' }}>{u.email}</td>
                  <td>{u.role === 'admin' ? 'Admin' : 'مستخدم'}</td>
                  <td><span className={`pill ${u.active ? 'pill-green' : 'pill-red'}`}>{u.active ? 'نشط' : 'موقوف'}</span></td>
                  <td>
                    {u.role === 'admin' ? '—' : (
                      <button className={`mini ${u.active ? 'danger' : 'soft'}`} onClick={() => toggle(u)}>
                        {u.active ? 'إيقاف' : 'تفعيل'}
                      </button>
                    )}
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
