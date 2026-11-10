# وين الكهرباء؟ — React

نسخة React من نموذج الواجهات، مبنية بـ Vite + react-router-dom + AOS.

## التشغيل

```bash
npm install
npm run dev
```

للبناء النهائي: `npm run build` ثم `npm run preview`.

## الصفحات (react-router-dom)

| المسار | الصفحة |
|---|---|
| `/` | الرئيسية (حالة المنطقة + الجدول + البلاغات) |
| `/report` | إرسال بلاغ |
| `/login` | تسجيل الدخول |
| `/register` | إنشاء حساب |
| `/admin` | نظرة عامة (أدمن فقط) |
| `/admin/reports` | إدارة البلاغات |
| `/admin/schedules` | جداول البرمجة (إضافة/تعديل/حذف) |
| `/admin/users` | المستخدمون |

## حساب الأدمن التجريبي

- البريد: `admin@example.com`
- كلمة المرور: `admin123`

أو أي حساب جديد من صفحة التسجيل (يكون بدور مستخدم عادي).

## الـ API الوهمي

كل شيء في `src/api/mockApi.js`. البيانات محفوظة في `localStorage` مع تأخير بسيط لمحاكاة الشبكة،
وفوق كل دالة تعليق يوضح الـ endpoint الحقيقي المقابل لها (مثل `POST /api/auth/login`).

لما يجهز الباك إند: استبدل جسم الدالة بـ `fetch(...)` وباقي التطبيق ما يحتاج تعديل.
لإعادة البيانات الأصلية امسح `localStorage` من أدوات المتصفح.

## الهيكل

```
src/
├─ api/mockApi.js          # endpoints وهمية
├─ context/                # AuthContext + ToastContext
├─ components/             # Navbar, PublicLayout, ProtectedRoute, ui
├─ pages/                  # Home, Report, Login, Register, NotFound
│  └─ admin/               # AdminLayout + صفحات اللوحة
├─ utils/format.js
├─ base.css                # ستايلات النموذج الأصلي
└─ styles.css              # إضافات React
```
