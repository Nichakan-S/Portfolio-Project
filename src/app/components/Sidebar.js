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
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    BarChartOutlined,
    SearchOutlined,
    PieChartOutlined,
    LineChartOutlined
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
                { key: 'usersCreate', label: (<Link href="/admin/usersCreate">เพิ่มบัญชีผู้ใช้งาน</Link>), icon: <PlusOutlined /> },
                { key: 'usersEdit', label: (<Link href="/admin/usersEdit">แก้ไขบัญชีผู้ใช้งาน</Link>), icon: <EditOutlined /> },
                { key: 'usersDelete', label: (<Link href="/admin/usersDelete">ลบบัญชีผู้ใช้งาน</Link>), icon: <DeleteOutlined /> },
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
        isAdmin && {
            key: 'activityHeader',
            label: 'กิจกรรมทั้งหมด',
            icon: <ProjectOutlined />,
            children: [
                { key: 'activityHeaderCreate', label: (<Link href="/admin/activityHeaderCreate">เพิ่มกิจกรรม</Link>), icon: <PlusOutlined /> },
                { key: 'activityHeaderEdit', label: (<Link href="/admin/activityHeaderEdit">แก้ไขกิจกรรม</Link>), icon: <EditOutlined /> },
                { key: 'activityHeaderDelete', label: (<Link href="/admin/activityHeaderDelete">ลบกิจกรรม</Link>), icon: <DeleteOutlined /> },
            ],
        },
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

    const userMenuItems = [
        isUser && { key: 'Home', label: (<Link href={`/users/${session.user.id}`}>หน้าแรก</Link>), icon: <HomeOutlined /> },
        isUser && {
            key: 'Schedule',
            label: 'บันทึกการสอน',
            icon: <ScheduleOutlined />,
            children: [
                { key: 'TCreate', label: (<Link href="/users/teachingCreate">เพิ่มวิชาสอน</Link>), icon: <PlusOutlined /> },
                { key: 'TEdit', label: (<Link href={`/users/teachingEdit/${session.user.id}`}>แก้ไขวิชาสอน</Link>), icon: <EditOutlined /> },
                { key: 'TDelete', label: (<Link href={`/users/teachingDelete/${session.user.id}`}>ลบวิชาสอน</Link>), icon: <DeleteOutlined /> },
            ],
        },
        isUser && {
            key: 'Activity',
            label: 'ผลงานกิจกรรม',
            icon: <ProjectOutlined />,
            children: [
                { key: 'ACreate', label: (<Link href="/users/activityCreate">เพิ่มผลงานกิจกรรม</Link>), icon: <PlusOutlined /> },
                { key: 'AEdit', label: (<Link href={`/users/activityEdit/${session.user.id}`}>แก้ไขผลงานกิจกรรม</Link>), icon: <EditOutlined /> },
                { key: 'ADelete', label: (<Link href={`/users/activityDelete/${session.user.id}`}>ลบผลงานกิจกรรม</Link>), icon: <DeleteOutlined /> },
            ],
        },
        isUser && {
            key: 'Research',
            label: 'ผลงานวิจัย',
            icon: <FileOutlined />,
            children: [
                { key: 'RCreate', label: (<Link href="/users/researchCreate">เพิ่มผลงานวิจัย</Link>), icon: <PlusOutlined /> },
                { key: 'REdit', label: (<Link href={`/users/researchEdit/${session.user.id}`}>แก้ไขผลงานวิจัย</Link>), icon: <EditOutlined /> },
                { key: 'RDelete', label: (<Link href={`/users/researchDelete/${session.user.id}`}>ลบผลงานวิจัย</Link>), icon: <DeleteOutlined /> },
            ],
        },
    ];

    const employeeMenuItems = [
        isEmployee && isUser && { key: 'employee', label: (<Link href="/users/employee">สำรวจบุคลากร</Link>), icon: <SearchOutlined /> },
    ];

    const overviewMenuItem = [
        isOverview && isUser && {
            key: 'overview',
            label: 'กราฟภาพรวม',
            icon: <BarChartOutlined />,
            children: [
                isOverview && isUser && { key: 'workArchive', label: (<Link href="/users/overview/workArchive">กราฟผลงาน</Link>), icon: <LineChartOutlined /> },
                isOverview && isUser && { key: 'activityArchive', label: (<Link href="/users/overview/activityArchive">กราฟกิจกรรม</Link>), icon: <PieChartOutlined /> }
            ],
        },
    ];

    const auditMenuItem = [
        isAudit && isUser && {
            key: 'audit',
            label: 'ตรวจสอบผลงาน',
            icon: <UserOutlined />,
            children: [
                isAudit && isUser && { key: 'auditTeaching', label: (<Link href={`/users/audit/teaching/${session.user.majorId}`}>บันทึกการสอน</Link>), icon: <ProjectOutlined /> },
                isAudit && isUser && { key: 'auditActivity', label: (<Link href={`/users/audit/activity/${session.user.majorId}`}>ผลงานกิจกรรม</Link>), icon: <ProjectOutlined /> },
                isAudit && isUser && { key: 'auditResearch', label: (<Link href={`/users/audit/research/${session.user.majorId}`}>ผลงานวิจัย</Link>), icon: <FileOutlined /> }
            ],
        },
    ];

    const approveMenuItem = [
        (isApproveResearch || isApproveActivity) && isUser && {
            key: 'approve',
            label: 'อนุมัติผลงาน',
            icon: <UserOutlined />,
            children: [
                isApproveActivity && isUser && { key: 'approveActivity', label: (<Link href="/users/approve/activity">ผลงานกิจกรรม</Link>), icon: <ProjectOutlined /> },
                isApproveResearch && isUser && { key: 'approveResearch', label: (<Link href="/users/approve/research">ผลงานวิจัย</Link>), icon: <FileOutlined /> }
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
