'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Menu } from 'antd';

function getItem(label, key, url) {
    return {
        key,
        label: <Link href={url}><a>{label}</a></Link>,
    };
}

const Sidebar = () => {
    const { data: session, status } = useSession();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedKey, setSelectedKey] = useState('1');

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.id) {
            const fetchUserData = async () => {
                const res = await fetch(`/api/user/${session.user.id}`);
                if (res.ok) {
                    const userData = await res.json();
                    setUser(userData);
                } else {
                    signOut({ callbackUrl: '/' });
                }
                setIsLoading(false);
            };

            fetchUserData();
        } else if (status === 'unauthenticated') {
            signIn('credentials', { callbackUrl: '/' });
        }
    }, [status, session]);

    const isAdmin = user?.role === 'admin';
    const isUser = user?.role === 'user';
    const isEmployee = user?.rank?.employee;
    const isEvaluation = user?.rank?.evaluation;
    const isOverview = user?.rank?.overview;
    const userMenuItems = [
        isUser && { key: 'Home', label: (<Link href={`/users/${session.user.id}`}>หน้าแรก</Link>) },
        isUser && { key: 'Schedule', label: (<Link href={`/users/manage_teaching/${session.user.id}`}>บันทึกการสอน</Link>) },

        isUser && {
            key: 'Work',
            label: 'ผลงานทั้งหมด',
            children: [
                { key: 'Activity', label: (<Link href={`/users/manage_activity/${session.user.id}`}>ผลงานกิจกรรม</Link>) },
                { key: 'Research', label: (<Link href={`/users/manage_research/${session.user.id}`}>ผลงานวิจัย</Link>) },
            ],
        },
    ];

    const adminMenuItems = [
        isAdmin && { key: 'home', label: (<Link href="/admin">หน้าแรก</Link>) },
        isAdmin && { key: 'faculty', label: (<Link href="/admin/faculty">คณะ</Link>) },
        isAdmin && { key: 'major', label: (<Link href="/admin/major">สาขา</Link>) },
        isAdmin && { key: 'rank', label: (<Link href="/admin/rank">ตำแหน่ง</Link>) },
        isAdmin && { key: 'users_management', label: (<Link href="/admin/users_management">บัญชีผู้ใช้งาน</Link>) },
        isAdmin && { key: 'subject', label: (<Link href="/admin/subject">วิชาทั้งหมด</Link>) },
        isAdmin && { key: 'activity', label: (<Link href="/admin/activity">กิจกรรมทั้งหมด</Link>) },
        isAdmin && {
            key: 'allwork',
            label: 'ผลงานทั้งหมด',
            children: [
                { key: 'manage_teaching', label: (<Link href="/admin/manage_teaching">บันทึกการสอน</Link>) },
                { key: 'manage_activity', label: (<Link href="/admin/manage_activity">ผลงานกิจกรรม</Link>) },
                { key: 'manage_research', label: (<Link href="/admin/manage_research">ผลงานวิจัย</Link>) },
            ],
        },
    ];
    

    const employeeMenuItems = [
        isEmployee && isUser && { key: 'employee', label: (<Link href="/users/employee">สำรวจบุคลากร</Link>) },
    ];

    const evaluationMenuItem = [
        isEvaluation && isUser && {
            key: 'evaluation',
            label: 'ประเมินบุคลากร',
            children: [
                { key: 'evaluationA', label: (<Link href="/users/evaluation/activity">ประเมินกิจกรรม</Link>) },
                { key: 'evaluationR', label: (<Link href="/users/evaluation/research">ประเมินวิจัย</Link>) }
            ],
        },
    ];

    const overviewMenuItem = [
        isOverview && isUser && { key: 'overview', label: (<Link href="/users/overview">ภาพรวม</Link>) },
    ];

    const items = [...userMenuItems, ...adminMenuItems, ...employeeMenuItems, ...evaluationMenuItem, ...overviewMenuItem].filter(Boolean);

    const onClick = e => {
        setSelectedKey(e.key);
    };

    if (isLoading || !user) {
        return (
            <aside>
            </aside>
        );
    }

    return (
        <aside>
            <Menu
                onClick={onClick}
                style={{
                    width: '14rem',
                    height: '100%',
                    backgroundColor: '#FFFFFF',
                    color: '#6C7AA3',
                    padding: '1rem',
                    fontSize: '16px',
                    fontWeight: 300,
                    margin: '5px 0'
                }}
                selectedKeys={[selectedKey]}
                mode="inline"
                items={items.map(item => ({
                    ...item,
                    style: {
                        fontWeight: item.key === selectedKey ? 800 : 300,
                    }
                }))}
                theme="light"
            />
        </aside>
    );
};

export default Sidebar;
