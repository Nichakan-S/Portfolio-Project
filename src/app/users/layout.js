import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

import { ConfigProvider } from "antd";

const UserLayout = ({ children }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: ""
        }
      }}
    >
      <div className="">
        <Navbar isAdmin={true} />
        <div className="flex flex-1">
          <Sidebar isAdmin={true} />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default UserLayout;