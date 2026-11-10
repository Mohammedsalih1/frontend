import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <footer className="footer">
        <div className="shell">
          وين الكهرباء؟ — نموذج واجهات أولي للتحدي البرمجي · البيانات المعروضة تجريبية وليست بيانات حقيقية.
        </div>
      </footer>
    </>
  );
}
