'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Descriptions, Card, Input, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import '/src/app/globals.css'

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('/api/user');
                const data = await res.json();
                setUsers(data);
            } catch (error) {
                console.error('การเรียกข้อมูลผู้ใช้ล้มเหลว', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="mt-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            </div>
        );
    }

    const filteredUsers = users.filter(user => {
        return user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.faculty?.facultyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.major?.majorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.rank?.rankname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold mb-6">บัญชีผู้ใช้งาน</h1>
                <div className="flex items-center">
                    <Input
                        className="flex-grow mr-2 p-1 text-base border rounded-xl custom-input"
                        placeholder="ค้นหาบัญชีผู้ใช้งาน..."
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ borderColor: '#2D427C', fontSize: '14px' }}
                    />
                </div>
            </div>
            <div style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                        <Card
                            key={user.id}
                            className="max-w-6xl mx-auto px-4 py-6 shadow-xl small-card"
                            style={{ headerHeight: '38px' }}
                            title={`${user.prefix} ${user.username} ${user.lastname}`}
                        >
                            <Descriptions layout="horizontal" size="small" className="small-descriptions">
                                <Descriptions.Item label="คณะ">{user.major?.faculty?.facultyName}</Descriptions.Item>
                                <Descriptions.Item label="สาขา">{user.major?.majorName}</Descriptions.Item>
                                <Descriptions.Item label="ตำแหน่ง">{user.position?.name}</Descriptions.Item>
                                <Descriptions.Item label="อีเมล">{user.email}</Descriptions.Item>
                                <Descriptions.Item label="บทบาท">{user.role}</Descriptions.Item>
                                <Descriptions.Item label="รหัสผ่าน">
                                    <Link href={`/admin/usersEdit/changePass/${user.id}`} style={{ color: '#FFD700', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        เปลี่ยนรหัสผ่าน
                                        <FontAwesomeIcon icon={faPen} style={{ fontSize: '16px', color: '#FFD758', marginLeft: '8px' }} />
                                    </Link>
                                </Descriptions.Item>
                            </Descriptions>
                            <div className="text-right">
                                <Link
                                    href={`/admin/usersEdit/${user.id}`}>
                                    <Button
                                        type="link"
                                        icon={<FontAwesomeIcon icon={faPen} style={{ fontSize: '16px', color: '#FFD758' }} />}
                                    />
                                </Link>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="text-center text-sm font-medium">ไม่มีข้อมูล</div>
                )}
            </div>
        </div>
    );
};

export default UserList;
