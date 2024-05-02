'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Menu } from 'antd';

function getItem(label, key, url) {
    return {
      key,
      label: <Link href={url}><a>{label}</a></Link>, // ใช้ Link จาก next/link สำหรับการนำทาง
    };
  }

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
    const userMenuItems = [
        isUser && { key: 'Home', label: (<Link href="/users">หน้าแรก</Link>) },
        isUser && { key: 'Schedule', label: (<Link href="/users/academic">ตารางสอน</Link>) },
        isUser && { key: 'Activity', label: (<Link href="/users/activity">ผลงานกิจกรรม</Link>) },
        isUser && { key: 'Research', label: (<Link href="/users/research">ผลงานวิจัย</Link>) },
    ];

    const adminMenuItems = [
        isAdmin && { key: 'admin', label: (<Link href="/admin" style={{ color: 'white' }} >หน้าแรก</Link>) },
        isAdmin && { key: 'faculty', label: (<Link href="/admin/faculty">คณะ</Link>) },
        isAdmin && { key: 'major', label: (<Link href="/admin/major">สาขา</Link>) },
        isAdmin && { key: 'rank', label: (<Link href="/admin/rank">ตำแหน่ง</Link>) },
        isAdmin && { key: 'users_management', label: (<Link href="/admin/users_management">จัดการผู้ใช้</Link>) },
        isAdmin && { key: 'subject', label: (<Link href="/admin/subject">วิชาทั้งหมด</Link>) },
        isAdmin && { key: 'manage_supject', label: (<Link href="/admin/manage_teaching">ตารางสอน</Link>) },
        isAdmin && { key: 'activity', label: (<Link href="/admin/activity">กิจกรรมทั้งหมด</Link>) },
        isAdmin && { key: 'manage_activity', label: (<Link href="/admin/manage_activity">ผลงานกิจกรรม</Link>) },
        isAdmin && { key: 'manage_research', label: (<Link href="/admin/manage_research">ผลงานวิจัย</Link>) },
    ];

    const employeeMenuItems = [
        isEmployee && { key: 'employee', label: (<Link href="/users/employee">Employee Section</Link>) },
    ];

    const evaluationMenuItem = [
        isEvaluation && { key: 'evaluation', label: (<Link href="/users/evaluation">Evaluation Section</Link>) },
    ];

    const overviewMenuItem = [
        isOverview && { key: 'overview', label: (<Link href="/users/overview">Overview Section</Link>) },
    ];

    const items = [...userMenuItems, ...adminMenuItems, ...employeeMenuItems, ...evaluationMenuItem, ...overviewMenuItem].filter(Boolean);

    const onClick = (e) => {
        console.log('click ', e);
      };

    if (isLoading || !user) {
        return <div>Loading...</div>;
    }

    return (      
        <aside >
            <Menu
                onClick={onClick}
                style={{
                    width: '15rem',
                    height: '100vh',
                    backgroundColor: '#212936',
                    color: 'white',
                    padding: '1rem',
                }}
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                mode="inline"
                items={items}
                theme="dark"
            />
        </aside>
    );
};

export default Sidebar;
