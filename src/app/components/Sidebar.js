'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const Sidebar = () => {
    const { data: session, status } = useSession();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // เมื่อ status เป็น 'authenticated' และมี session.user.id ที่ถูกต้อง
        if (status === 'authenticated' && session?.user?.id) {
            const fetchUserData = async () => {
                const res = await fetch(`/api/user/${session.user.id}`); // path ที่ถูกต้องตาม backend
                if (res.ok) {
                    const userData = await res.json();
                    setUser(userData);
                } else {
                    // ถ้า fetch ไม่สำเร็จ, ให้ logout
                    signOut({ callbackUrl: '/' });
                }
                setIsLoading(false);
            };

            fetchUserData();
        } else if (status === 'unauthenticated') {
            // ถ้าไม่ได้เข้าสู่ระบบ, ให้ไปที่หน้า login
            signIn('credentials', { callbackUrl: '/' });
        }
    }, [status, session]);

    // ตรวจสอบสถานะและ permissions ของ user
    const isAdmin = user?.role === 'admin';
    const isUser = user?.role === 'user';
    const isEmployee = user?.rank?.employee;
    const isEvaluation = user?.rank?.evaluation;
    const isOverview = user?.rank?.overview;

    if (isLoading || !user) {
        return <div>Loading...</div>;
    }

    return (
        <aside className="w-64 bg-gray-800 text-white p-4">
            {/* Sidebar สำหรับ Users */}
            <ul>
                {isUser && (
                    <>
                        <li className="mb-3">
                            <Link href="/users">หน้าแรก</Link>
                        </li>
                        <li className="mb-3">
                            <Link href="/users/">ตารางสอน</Link>
                        </li>
                        <li className="mb-3">
                            <Link href="/users/">ผลงานกิจกรรม</Link>
                        </li>
                        <li className="mb-3">
                            <Link href="/users/">ผลงานวิจัย</Link>
                        </li>
                    </>
                )}

                {isAdmin && (
                    <>
                        <li className="mb-3">
                            <Link href="/admin">หน้าแรก</Link>
                        </li>
                        <li className="mb-3">
                            <Link href="/admin/faculty">คณะ</Link>
                        </li>
                        <li className="mb-3">
                            <Link href="/admin/major">สาขา</Link>
                        </li>
                        <li className="mb-3">
                            <Link href="/admin/rank">ตำแหน่ง</Link>
                        </li>
                        <li className="mb-3">
                            <Link href="/admin/users_management">จัดการผู้ใช้</Link>
                        </li>
                        <li className="mb-3">
                            <Link href="/admin/subject">วิชาทั้งหมด</Link>
                        </li>
                        <li className="mb-3">
                            <Link href="/admin/manage_supject">ตารางสอน</Link>
                        </li>
                        <li className="mb-3">
                            <Link href="/admin/activity">กิจกรรมทั้งหมด</Link>
                        </li>
                        <li className="mb-3">
                            <Link href="/admin/manage_activity">ผลงานกิจกรรม</Link>
                        </li>
                        <li className="mb-3">
                            <Link href="/admin/manage_research">ผลงานวิจัย</Link>
                        </li>
                    </>
                )}

                {isEmployee && (
                    <li className="mb-3">
                        <Link href="/users/employee">Employee Section</Link>
                    </li>

                )}

                {isEvaluation && (
                    <li className="mb-3">
                        <Link href="/users/evaluation">Evaluation Section</Link>
                    </li>
                )}

                {isOverview && (
                    <li className="mb-3">
                        <Link href="/users/overview">Overview Section</Link>
                    </li>
                )}
                {/* เพิ่มลิงก์อื่นๆ ที่นี่ */}
            </ul>
        </aside>
    );
};

export default Sidebar;
