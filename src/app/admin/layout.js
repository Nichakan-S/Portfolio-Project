'use client'

import React from 'react';
import AdminNevbar from '../components/admin_nevbar.js';

const AdminLayout = ({ children }) => {
  return (
    <div>
      <AdminNevbar /> {/* เพิ่มเมนูที่นี่ */}
        <main>
          {children}
        </main>
      </div>
  );
};

export default AdminLayout;
