'use client'

import Link from 'next/link';
import { useSession } from 'next-auth/react';

const Sidebar = () => {
    const { data: session } = useSession();
    // ตรวจสอบว่า session ได้ถูกโหลดและมี user หรือไม่
    const isAdmin = session?.user?.role === 'admin';
    const isUser = session?.user?.role === 'user';

    return (
        <aside className="w-64 bg-gray-800 text-white p-4">
            {/* Sidebar สำหรับ Users */}
            <ul>
                {isUser && (
                    <li className="mb-3">
                        <Link href="/users/somepage">User Dashboard</Link>
                    </li>
                )}

                {isAdmin && (
                    <li className="mb-3">
                        <Link href="/admin/somepage">Admin Dashboard</Link>
                    </li>
                )}

                {session?.user?.employee && (
                    <li className="mb-3">
                        <Link href="/admin/employee">Employee Section</Link>
                    </li>
                )}

                {session?.user?.evaluation && (
                    <li className="mb-3">
                        <Link href="/admin/evaluation">evaluation Section</Link>
                    </li>
                )}

                {session?.user?.overview && (
                    <li className="mb-3">
                        <Link href="/admin/overview">overview Section</Link>
                    </li>
                )}
                {/* เพิ่มลิงก์อื่นๆ ที่นี่ */}
            </ul>
        </aside>
    );
};

export default Sidebar;
