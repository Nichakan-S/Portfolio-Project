'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Menu, Skeleton } from 'antd';
import {
    HomeOutlined,
    ScheduleOutlined,
    AppstoreOutlined,
    UserOutlined,
    BookOutlined,
    TeamOutlined,
    FileOutlined,
    ProjectOutlined
} from '@ant-design/icons';

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
        isUser && { key: 'Home', label: (<Link href={`/users/${session.user.id}`}>หน้าแรก</Link>), icon: <HomeOutlined /> },
        isUser && { key: 'Schedule', label: (<Link href={`/users/manage_teaching/${session.user.id}`}>บันทึกการสอน</Link>), icon: <ScheduleOutlined /> },

        isUser && {
            key: 'Work',
            label: 'ผลงานทั้งหมด',
            icon: <AppstoreOutlined />,
            children: [
                { key: 'Activity', label: (<Link href={`/users/manage_activity/${session.user.id}`}>ผลงานกิจกรรม</Link>), icon: <ProjectOutlined /> },
                { key: 'Research', label: (<Link href={`/users/manage_research/${session.user.id}`}>ผลงานวิจัย</Link>), icon: <FileOutlined /> },
            ],
        },
    ];

    const adminMenuItems = [
        isAdmin && { key: 'home', label: (<Link href="/admin">หน้าแรก</Link>), icon: <HomeOutlined /> },
        isAdmin && { key: 'faculty', label: (<Link href="/admin/faculty">คณะ</Link>), icon: <TeamOutlined /> },
        isAdmin && { key: 'major', label: (<Link href="/admin/major">สาขา</Link>), icon: <BookOutlined /> },
        isAdmin && { key: 'rank', label: (<Link href="/admin/rank">ตำแหน่ง</Link>), icon: <UserOutlined /> },
        isAdmin && { key: 'users_management', label: (<Link href="/admin/users_management">บัญชีผู้ใช้งาน</Link>), icon: <UserOutlined /> },
        isAdmin && { key: 'subject', label: (<Link href="/admin/subject">วิชาทั้งหมด</Link>), icon: <BookOutlined /> },
        isAdmin && { key: 'activity', label: (<Link href="/admin/activity">กิจกรรมทั้งหมด</Link>), icon: <ProjectOutlined /> },
        isAdmin && {
            key: 'allwork',
            label: 'ผลงานทั้งหมด',
            icon: <AppstoreOutlined />,
            children: [
                { key: 'manage_teaching', label: (<Link href="/admin/manage_teaching">บันทึกการสอน</Link>), icon: <ScheduleOutlined /> },
                { key: 'manage_activity', label: (<Link href="/admin/manage_activity">ผลงานกิจกรรม</Link>), icon: <ProjectOutlined /> },
                { key: 'manage_research', label: (<Link href="/admin/manage_research">ผลงานวิจัย</Link>), icon: <FileOutlined /> },
            ],
        },
    ];

    const employeeMenuItems = [
        isEmployee && isUser && { key: 'employee', label: (<Link href="/users/employee">สำรวจบุคลากร</Link>), icon: <TeamOutlined /> },
    ];

    const overviewMenuItem = [
        isOverview && isUser && { key: 'overview', label: (<Link href="/users/overview">ภาพรวมบุคลากร</Link>), icon: <TeamOutlined /> },
    ];

    const evaluationMenuItem = [
        isEvaluation && isUser && {
            key: 'evaluation',
            label: 'ประเมินบุคลากร',
            icon: <UserOutlined />,
            children: [
                { key: 'evaluationA', label: (<Link href="/users/evaluation/activity">ประเมินกิจกรรม</Link>), icon: <ProjectOutlined /> },
                { key: 'evaluationR', label: (<Link href="/users/evaluation/research">ประเมินวิจัย</Link>), icon: <FileOutlined /> }
            ],
        },
    ];

    const items = [...userMenuItems, ...adminMenuItems, ...overviewMenuItem, ...employeeMenuItems, ...evaluationMenuItem].filter(Boolean);

    const onClick = e => {
        setSelectedKey(e.key);
    };

    if (isLoading || !user) {
        const skeletonItems = Array(5).fill(null).map((_, index) => ({
            key: `skeleton-${index}`,
            label: <Skeleton.Button style={{ width: 180, marginBottom: 10 }} active size="small" shape="round" />,
            icon: <Skeleton.Avatar active size="small" shape="circle" />,
        }));

    return (
        <div className="h-screen w-64 bg-[#000c17] p-4">
            <div className="flex items-center mb-2">
                <Image src="/image/Newchandralogo1.png" alt="Description" width={40} height={40} />
                <h1 className="text-xl font-bold ml-2 text-gray-300">Chandra</h1>
            </div>
            <Menu
            
                onClick={onClick}
                className="bg-[#000c17] text-base"
                selectedKeys={[selectedKey]}
                mode="inline"
                items={items.map(item => ({
                    ...item,
                    style: {
                        fontWeight: item.key === selectedKey ? 800 : 300,
                    }
                }))}
                theme="dark"
            />

        </div>
    );

};

export default Sidebar;
