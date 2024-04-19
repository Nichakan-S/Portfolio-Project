

import dynamic from 'next/dynamic';
import Navbar from '../components/Navbar';

const SidebarDynamic = dynamic(() => import('../components/Sidebar'), {
  ssr: false,
});

const PageLayout = ({children}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isUser={true} />
      <div className="flex flex-1">
        {/* เรียกใช้ Sidebar ที่ถูกนำเข้าแบบ dynamic */}
        <SidebarDynamic isUser={true} />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PageLayout;