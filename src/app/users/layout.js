<<<<<<< HEAD
import React from 'react';
import Layout from '../components/LayoutNavigator'; // Adjust the path as needed
=======


import dynamic from 'next/dynamic';
import Navbar from '../components/Navbar';

const SidebarDynamic = dynamic(() => import('../components/Sidebar'), {
  ssr: false,
});
>>>>>>> origin

const PageLayout = () => {
  return (
<<<<<<< HEAD
    <Layout>
      {/* Content specific to this page */}
      <p>This is the content of the  main page.</p>
    </Layout>
=======
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
>>>>>>> origin
  );
};

export default PageLayout;