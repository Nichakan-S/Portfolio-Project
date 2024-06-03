'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Descriptions, Card, Button, Avatar, Row, Col } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import '/src/app/globals.css'
import SearchInput from '/src/app/components/SearchInputAll.jsx';

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
            user.major?.faculty?.facultyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.major?.majorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.position?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold mb-6" style={{ color: "#2D427C" }}>บุคลากร</h1>
                <SearchInput
                    value={searchTerm}
                    onChange={(value) => setSearchTerm(value)}
                    placeholder="ค้นหาบุคลากร..."
                />
            </div>
            <div style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                        <Card
                            key={user.id}
                            className="max-w-6xl mx-auto px-4 py-6 shadow-xl small-card"
                            style={{ headerHeight: '38px' }}
                        >
                            <Row gutter={16}>
                                <Col span={6} style={{ display: 'flex', justifyContent: 'center',  }}>
                                    <div className="cursor-pointer text-center">
                                        {user.userImage ? (
                                            <Avatar
                                                size={100}
                                                src={user.userImage || '/image/none_image.png'}
                                                onError={() => {
                                                    return true;
                                                }}
                                            />
                                        ) : (
                                            <Image
                                                src="/image/none_image.png"
                                                alt="Default profile image"
                                                width={100}
                                                height={100}
                                                className="rounded-full"
                                            />
                                        )}
                                    </div>
                                </Col>
                                <Col span={18}>
                                    <Descriptions layout="vertical" size="small" className="small-descriptions">
                                        <Descriptions.Item label="ชื่อ">{user.position?.name} {user.username} {user.lastname}</Descriptions.Item>
                                        <Descriptions.Item label="คณะ">{user.major?.faculty?.facultyName}</Descriptions.Item>
                                        <Descriptions.Item label="สาขา">{user.major?.majorName}</Descriptions.Item>
                                        <Descriptions.Item label="อีเมล">{user.email}</Descriptions.Item>
                                        <Descriptions.Item label="บทบาท">{user.role}</Descriptions.Item>
                                    </Descriptions>
                                    <div className="text-right mt-4">
                                        <Link href={`/users/employee/activity/${user.id}`} className="text-indigo-600 hover:text-indigo-900">
                                            ดูกิจกรรม
                                        </Link>
                                        <Link href={`/users/employee/research/${user.id}`} className="text-indigo-600 hover:text-indigo-900 ml-4">
                                            ดูวิจัย
                                        </Link>
                                    </div>
                                </Col>
                            </Row>
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
