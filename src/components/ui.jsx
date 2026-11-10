import { useEffect } from 'react';

export const statusPill = (status) => (status === 'شغالة' ? 'pill-green' : 'pill-red');

export function Pill({ status }) {
  return <span className={`pill ${statusPill(status)}`}>{status}</span>;
}

export function ReviewPill({ review }) {
  if (review === 'pending') return <span className="pill pill-amber">قيد المراجعة</span>;
  if (review === 'approved') return <span className="pill pill-green">معتمد</span>;
  return <span className="pill pill-red">مرفوض</span>;
}

export function Loader({ text = 'جاري التحميل...' }) {
  return (
    <div className="loader">
      <span className="spinner" /> {text}
    </div>
  );
}

export function Modal({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal-back show" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="close" onClick={onClose} aria-label="إغلاق">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
