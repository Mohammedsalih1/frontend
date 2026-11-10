/**
 * API وهمي (Mock API)
 * -------------------------------------------------
 * يحاكي endpoints حقيقية باستخدام localStorage + تأخير بسيط.
 * لما تجهّز الباك إند الحقيقي: استبدل جسم كل دالة بـ fetch إلى
 * الـ endpoint الموضح في التعليق فوقها، وباقي التطبيق ما يتغير.
 */

const DB_KEY = 'wk_db_v1';
const SESSION_KEY = 'wk_session_v1';

const now = Date.now();
const min = 60 * 1000;

const seed = {
  areas: [
    { id: 'kalakla', name: 'الكلاكلة', city: 'الخرطوم', state: 'شغالة' },
    { id: 'omdurman', name: 'الثورة', city: 'أم درمان', state: 'قاطعة' },
    { id: 'bahri', name: 'شمبات', city: 'بحري', state: 'شغالة' },
    { id: 'riyadh', name: 'الرياض', city: 'الخرطوم', state: 'قاطعة' },
  ],
  schedules: [
    { id: 1, areaId: 'kalakla', day: 'اليوم', cut: '18:00', back: '22:00' },
    { id: 2, areaId: 'kalakla', day: 'غداً', cut: '14:00', back: '18:00' },
    { id: 3, areaId: 'omdurman', day: 'اليوم', cut: '14:00', back: '18:00' },
    { id: 4, areaId: 'bahri', day: 'اليوم', cut: '20:00', back: '00:00' },
    { id: 5, areaId: 'riyadh', day: 'اليوم', cut: '16:00', back: '20:00' },
  ],
  reports: [
    { id: 1, areaId: 'kalakla', place: 'القبة', status: 'شغالة', desc: 'الكهرباء شغالة حالياً بعد انقطاع قصير.', createdAt: now - 8 * min, review: 'approved', author: 'زائر' },
    { id: 2, areaId: 'kalakla', place: 'صنقعت', status: 'قاطعة', desc: 'الكهرباء قاطعة من حوالي ساعة.', createdAt: now - 24 * min, review: 'pending', author: 'زائر' },
    { id: 3, areaId: 'kalakla', place: 'الوحدة', status: 'شغالة', desc: 'الوضع مستقر والكهرباء موجودة.', createdAt: now - 41 * min, review: 'approved', author: 'زائر' },
    { id: 4, areaId: 'omdurman', place: 'الحارة 12', status: 'قاطعة', desc: 'انقطاع مستمر منذ العصر.', createdAt: now - 60 * min, review: 'pending', author: 'زائر' },
  ],
  users: [
    { id: 1, name: 'مدير النظام', email: 'admin@example.com', password: 'admin123', role: 'admin', active: true },
    { id: 2, name: 'أحمد محمد', email: 'ahmed@example.com', password: '123456', role: 'user', active: true },
    { id: 3, name: 'سارة علي', email: 'sara@example.com', password: '123456', role: 'user', active: true },
  ],
};

function load() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  localStorage.setItem(DB_KEY, JSON.stringify(seed));
  return structuredClone(seed);
}

function save(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

const wait = (ms = 450) => new Promise((r) => setTimeout(r, ms));

function fail(message, status = 400) {
  const err = new Error(message);
  err.status = status;
  return err;
}

const nextId = (list) => list.reduce((m, x) => Math.max(m, x.id), 0) + 1;
const publicUser = ({ password, ...u }) => u;

function requireAdmin() {
  const s = getSession();
  if (!s || s.user.role !== 'admin') throw fail('غير مصرّح', 403);
}

/* ============ Session helpers ============ */
export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

/* ============ Auth ============ */

// POST /api/auth/login
export async function login({ email, password }) {
  await wait();
  const db = load();
  const u = db.users.find((x) => x.email.toLowerCase() === email.trim().toLowerCase());
  if (!u || u.password !== password) throw fail('البريد أو كلمة المرور غير صحيحة', 401);
  if (!u.active) throw fail('هذا الحساب موقوف', 403);
  const session = { token: 'mock-jwt-' + Math.random().toString(36).slice(2), user: publicUser(u) };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

// POST /api/auth/register
export async function register({ name, email, password }) {
  await wait();
  const db = load();
  if (db.users.some((x) => x.email.toLowerCase() === email.trim().toLowerCase())) {
    throw fail('هذا البريد مسجّل مسبقاً', 409);
  }
  const user = { id: nextId(db.users), name: name.trim(), email: email.trim(), password, role: 'user', active: true };
  db.users.push(user);
  save(db);
  const session = { token: 'mock-jwt-' + Math.random().toString(36).slice(2), user: publicUser(user) };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

// POST /api/auth/logout
export async function logout() {
  await wait(150);
  localStorage.removeItem(SESSION_KEY);
}

/* ============ Public ============ */

// GET /api/areas
export async function getAreas() {
  await wait(200);
  return load().areas;
}

// GET /api/areas/:id  (المنطقة + الجدول + البلاغات المعتمدة + الحالة الفعلية)
export async function getAreaOverview(areaId) {
  await wait();
  const db = load();
  const area = db.areas.find((a) => a.id === areaId);
  if (!area) throw fail('المنطقة غير موجودة', 404);
  const schedules = db.schedules.filter((s) => s.areaId === areaId);
  const reports = db.reports
    .filter((r) => r.areaId === areaId && r.review === 'approved')
    .sort((a, b) => b.createdAt - a.createdAt);
  const dayAgo = Date.now() - 24 * 60 * min;
  const todayCount = db.reports.filter((r) => r.areaId === areaId && r.createdAt > dayAgo).length;
  const actual = reports[0]?.status || area.state;
  return { area, schedules, reports, actual, todayCount, lastUpdate: reports[0]?.createdAt || null };
}

// POST /api/reports
export async function createReport({ areaId, place, status, desc }) {
  await wait();
  const db = load();
  const session = getSession();
  const report = {
    id: nextId(db.reports),
    areaId,
    place: place?.trim() || '',
    status,
    desc: desc.trim(),
    createdAt: Date.now(),
    review: 'pending',
    author: session?.user?.name || 'زائر',
  };
  db.reports.unshift(report);
  save(db);
  return report;
}

/* ============ Admin ============ */

// GET /api/admin/stats
export async function getAdminStats() {
  await wait(300);
  requireAdmin();
  const db = load();
  return {
    reports: db.reports.length,
    pending: db.reports.filter((r) => r.review === 'pending').length,
    users: db.users.length,
    areas: db.areas.length,
  };
}

// GET /api/admin/reports?review=pending|approved|rejected
export async function getAdminReports(review = 'all') {
  await wait(300);
  requireAdmin();
  const db = load();
  const areaName = Object.fromEntries(db.areas.map((a) => [a.id, `${a.name} — ${a.city}`]));
  return db.reports
    .filter((r) => review === 'all' || r.review === review)
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((r) => ({ ...r, areaLabel: r.place ? `${areaName[r.areaId]} (${r.place})` : areaName[r.areaId] }));
}

// PATCH /api/admin/reports/:id
export async function setReportReview(id, review) {
  await wait(250);
  requireAdmin();
  const db = load();
  const r = db.reports.find((x) => x.id === id);
  if (!r) throw fail('البلاغ غير موجود', 404);
  r.review = review;
  save(db);
  return r;
}

// GET /api/admin/schedules
export async function getSchedules() {
  await wait(300);
  requireAdmin();
  const db = load();
  const areaName = Object.fromEntries(db.areas.map((a) => [a.id, a.name]));
  return db.schedules.map((s) => ({ ...s, areaName: areaName[s.areaId] }));
}

// POST /api/admin/schedules   |   PUT /api/admin/schedules/:id
export async function saveSchedule(data) {
  await wait(300);
  requireAdmin();
  const db = load();
  if (data.id) {
    const i = db.schedules.findIndex((s) => s.id === data.id);
    if (i === -1) throw fail('الجدول غير موجود', 404);
    db.schedules[i] = { ...db.schedules[i], ...data };
  } else {
    db.schedules.push({ ...data, id: nextId(db.schedules) });
  }
  save(db);
}

// DELETE /api/admin/schedules/:id
export async function deleteSchedule(id) {
  await wait(250);
  requireAdmin();
  const db = load();
  db.schedules = db.schedules.filter((s) => s.id !== id);
  save(db);
}

// GET /api/admin/users
export async function getUsers() {
  await wait(300);
  requireAdmin();
  return load().users.map(publicUser);
}

// PATCH /api/admin/users/:id
export async function toggleUserActive(id) {
  await wait(250);
  requireAdmin();
  const db = load();
  const u = db.users.find((x) => x.id === id);
  if (!u) throw fail('المستخدم غير موجود', 404);
  if (u.role === 'admin') throw fail('لا يمكن إيقاف حساب الأدمن');
  u.active = !u.active;
  save(db);
}

// أداة للتطوير: إعادة البيانات الأصلية
export function resetMockDb() {
  localStorage.removeItem(DB_KEY);
  localStorage.removeItem(SESSION_KEY);
}
