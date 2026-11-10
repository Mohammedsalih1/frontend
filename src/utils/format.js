// تحويل "18:00" إلى "06:00 مساءً"
export function formatTime(hhmm) {
  if (!hhmm) return '—';
  const [h, m] = hhmm.split(':').map(Number);
  if (h === 0 && m === 0) return '12:00 منتصف الليل';
  const period = h >= 12 ? (h < 16 ? 'ظهراً' : h < 18 ? 'عصراً' : 'مساءً') : 'صباحاً';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
}

export function timeAgo(ts) {
  const diff = Math.max(0, Date.now() - ts);
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'الآن';
  if (min < 60) return `منذ ${min} دقيقة`;
  const hours = Math.floor(min / 60);
  if (hours < 24) return `منذ ${hours} ساعة`;
  return `منذ ${Math.floor(hours / 24)} يوم`;
}
