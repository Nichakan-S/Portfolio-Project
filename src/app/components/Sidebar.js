'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Menu } from 'antd';
import {
    HomeOutlined,
    ScheduleOutlined,
    AppstoreOutlined,
    UserOutlined,
    BookOutlined,
    TeamOutlined,
    FileOutlined,
    ProjectOutlined,
    UserDeleteOutlined,
    UserAddOutlined,
    UserSwitchOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined
} from '@ant-design/icons';

const Sidebar = () => {
    const { data: session, status } = useSession();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedKey, setSelectedKey] = useState('1');
    const [openKeys, setOpenKeys] = useState([]);

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
    const isEmployee = user?.position?.employee;
    const isAudit = user?.position?.audit;
    const isApproveResearch = user?.position?.approveResearch;
    const isApproveActivity = user?.position?.approveActivity;
    const isOverview = user?.position?.overview;

    const userMenuItems = [
        isUser && { key: 'Home', label: (<Link href={`/users/${session.user.id}`}>หน้าแรก</Link>), icon: <HomeOutlined /> },
        isUser && { key: 'Schedule', label: (<Link href={`/users/teaching/${session.user.id}`}>บันทึกการสอน</Link>), icon: <ScheduleOutlined /> },
        isUser && {
            key: 'Work',
            label: 'ผลงานทั้งหมด',
            icon: <AppstoreOutlined />,
            children: [
                { key: 'Activity', label: (<Link href={`/users/activity/${session.user.id}`}>ผลงานกิจกรรม</Link>), icon: <ProjectOutlined /> },
                { key: 'Research', label: (<Link href={`/users/research/${session.user.id}`}>ผลงานวิจัย</Link>), icon: <FileOutlined /> },
            ],
        },
    ];

    const adminMenuItems = [
        isAdmin && { key: 'home', label: (<Link href={`/admin/${session.user.id}`}>หน้าแรก</Link>), icon: <HomeOutlined /> },
        isAdmin && { key: 'faculty', label: (<Link href="/admin/faculty">คณะ</Link>), icon: <TeamOutlined /> },
        isAdmin && { key: 'major', label: (<Link href="/admin/major">สาขา</Link>), icon: <BookOutlined /> },
        isAdmin && { key: 'position', label: (<Link href="/admin/position">ตำแหน่ง</Link>), icon: <UserOutlined /> },
        isAdmin && {
            key: 'usersManagement',
            label: 'จัดการบัญชีผู้ใช้งาน',
            icon: <UserOutlined />,
            children: [
                { key: 'usersCreate', label: (<Link href="/admin/usersCreate">เพิ่มบัญชีผู้ใช้งาน</Link>), icon: <UserAddOutlined /> },
                { key: 'usersEdit', label: (<Link href="/admin/usersEdit">แก้ไขบัญชีผู้ใช้งาน</Link>), icon: <UserSwitchOutlined /> },
                { key: 'usersDelete', label: (<Link href="/admin/usersDelete">ลบบัญชีผู้ใช้งาน</Link>), icon: <UserDeleteOutlined /> },
            ],
        },
        isAdmin && {
            key: 'subject',
            label: 'จัดการวิชาทั้งหมด',
            icon: <BookOutlined />,
            children: [
                { key: 'subjectCreate', label: (<Link href="/admin/subjectCreate">เพิ่มรายวิชา</Link>), icon: <PlusOutlined /> },
                { key: 'subjectEdit', label: (<Link href="/admin/subjectEdit">แก้ไขรายวิชา</Link>), icon: <EditOutlined /> },
                { key: 'subjectDelete', label: (<Link href="/admin/subjectDelete">ลบรายวิชา</Link>), icon: <DeleteOutlined /> },
            ],
        },
        isAdmin && { key: 'activityHeader', label: (<Link href="/admin/activityHeader">กิจกรรมทั้งหมด</Link>), icon: <ProjectOutlined /> },
        isAdmin && {
            key: 'allwork',
            label: 'ผลงานทั้งหมด',
            icon: <AppstoreOutlined />,
            children: [
                { key: 'teaching', label: (<Link href="/admin/teaching">บันทึกการสอน</Link>), icon: <ScheduleOutlined /> },
                { key: 'activity', label: (<Link href="/admin/activity">ผลงานกิจกรรม</Link>), icon: <ProjectOutlined /> },
                { key: 'research', label: (<Link href="/admin/research">ผลงานวิจัย</Link>), icon: <FileOutlined /> },
            ],
        },
    ];

    const employeeMenuItems = [
        isEmployee && isUser && { key: 'employee', label: (<Link href="/users/employee">สำรวจบุคลากร</Link>), icon: <TeamOutlined /> },
    ];

    const overviewMenuItem = [
        isOverview && isUser && { key: 'overview', label: (<Link href="/users/overview">ภาพรวมบุคลากร</Link>), icon: <TeamOutlined /> },
    ];

    const approveMenuItem = [
        (isApproveResearch || isApproveActivity) && isUser && {
            key: 'approve',
            label: 'อนุมัติผลงาน',
            icon: <UserOutlined />,
            children: [
                isApproveResearch && isUser && { key: 'evaluationA', label: (<Link href="/users/evaluation/activity">ผลงานกิจกรรม</Link>), icon: <ProjectOutlined /> },
                isApproveActivity && isUser && { key: 'evaluationR', label: (<Link href="/users/evaluation/research">ผลงานวิจัย</Link>), icon: <FileOutlined /> }
            ],
        },
    ];

    const auditMenuItem = [
        isAudit && isUser && {
            key: 'approve',
            label: 'ตรวจสอบผลงาน',
            icon: <UserOutlined />,
            children: [
                isApproveResearch && isUser && { key: 'evaluationA', label: (<Link href="/users/evaluation/activity">ผลงานกิจกรรม</Link>), icon: <ProjectOutlined /> },
                isApproveActivity && isUser && { key: 'evaluationR', label: (<Link href="/users/evaluation/research">ผลงานวิจัย</Link>), icon: <FileOutlined /> }
            ],
        },
    ];

    const items = [...userMenuItems, ...adminMenuItems, ...overviewMenuItem, ...employeeMenuItems, ...approveMenuItem, ...auditMenuItem].filter(Boolean);

    const onClick = e => {
        setSelectedKey(e.key);
    };

    const onOpenChange = keys => {
        setOpenKeys(keys.length ? [keys[keys.length - 1]] : []);
    };

    if (isLoading) {
        return (
            <div className="h-screen w-64 bg-[#000c17] p-4">
                <div className="flex items-center mb-2">
                    <div className="rounded-full bg-gray-400 w-12 h-12 animate-pulse"></div>
                    <div className="ml-4 bg-gray-400 w-32 h-6 rounded py-4 animate-pulse"></div>
                </div>
                <div className="bg-gray-400 w-full h-4 mb-4 py-4 rounded animate-pulse"></div>
                <div className="bg-gray-400 w-full h-4 mb-4 py-4 rounded animate-pulse"></div>
                <div className="bg-gray-400 w-full h-4 mb-4 py-4 rounded animate-pulse"></div>
                <div className="bg-gray-400 w-full h-4 mb-4 py-4 rounded animate-pulse"></div>
                <div className="bg-gray-400 w-full h-4 mb-4 py-4 rounded animate-pulse"></div>
            </div>
        );
    }

    return (
        <div className="h-screen w-64 bg-[#000c17] p-4">
            <div className="flex items-center mb-2">
                <Image src="/image/Newchandralogo1.png" alt="Description" width={40} height={40} />
                <h1 className="text-xl font-bold ml-2 text-gray-300">Chandra</h1>
            </div>
            <Menu
                onClick={onClick}
                onOpenChange={onOpenChange}
                className="bg-[#000c17] text-base"
                selectedKeys={[selectedKey]}
                openKeys={openKeys}
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