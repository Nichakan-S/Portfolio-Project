import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { ConfigProvider } from 'antd';

const AdminLayout = ({ children }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: ''
        }
      }}
    >
      <div className="flex h-screen">
        <Sidebar isAdmin={true} className="w-64" />
        <div className="flex flex-col flex-1">
          <Navbar isAdmin={true} />
          <main className="flex-1 p-4 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default AdminLayout;
