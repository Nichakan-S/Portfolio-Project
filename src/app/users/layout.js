import React from 'react';
import Link from 'next/link';

const UserLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-blue-500 text-white p-4">
        {/* Navbar สำหรับ Users */}
        <Link href="/users/dashboard">Dashboard</Link>
        {/* เพิ่มลิงก์อื่นๆ ที่นี่ */}
      </nav>
      <div className="flex flex-1">
        <aside className="w-64 bg-gray-800 text-white p-4">
          {/* Sidebar สำหรับ Users */}
          <ul>
            <li >
              <Link href="/users/somepage">Some Page</Link>
            </li>
            {/* เพิ่มลิงก์อื่นๆ ที่นี่ */}
          </ul>
        </aside>
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
