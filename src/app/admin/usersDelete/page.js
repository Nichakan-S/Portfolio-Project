'use client'

import React, { useEffect, useState } from 'react';
import { Descriptions, Card, Input, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { SuccessAlert, WarningAlert, ConfirmAlert } from '../../components/sweetalert';
import '/src/app/globals.css';
import SearchInput from '/src/app/components/SearchInput';

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

    const handleDelete = async (id) => {
        ConfirmAlert('คุณแน่ใจที่จะลบข้อมูลนี้?', 'การดำเนินการนี้ไม่สามารถย้อนกลับได้', async () => {
            try {
                const response = await fetch(`/api/user/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error('Failed to delete the user.');
                SuccessAlert('ลบสำเร็จ!', 'ข้อมูลถูกลบแล้ว');
                setUsers(users.filter(user => user.id !== id));
            } catch (error) {
                console.error('Failed to delete the user', error);
                WarningAlert('ผิดพลาด!', 'ไม่สามารถลบข้อมูลได้');
            }
        });
    };

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
                <h1 className="text-3xl font-bold mb-6" style={{ color: "#2D427C" }}>บัญชีผู้ใช้งาน</h1>
                <SearchInput
                    value={searchTerm}
                    onChange={(value) => setSearchTerm(value)}
                    placeholder="ค้นหาบัญชีผู้ใช้งาน..."
                />
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
                            </Descriptions>
                            <div className="text-right">
                                <Button
                                    type="button"
                                    onClick={() => handleDelete(user.id)}
                                    icon={<FontAwesomeIcon icon={faTrash} style={{ fontSize: '16px', color: '#FF0000' }} />}
                                />
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
