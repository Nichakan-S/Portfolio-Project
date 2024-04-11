import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isAdmin={true} />
      <div className="flex flex-1">
        {/* เรียกใช้ Sidebar ที่ถูกนำเข้าแบบ dynamic */}
        <Sidebar isAdmin={true} />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
