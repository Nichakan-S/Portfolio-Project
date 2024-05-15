'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SuccessAlert, WarningAlert} from '../../../../components/sweetalert';
import { Button, Avatar, Select, Card, Row, Col, Input } from 'antd';


const EditPassUser = ({ params }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const router = useRouter();
    const { id } = params;

    const validateForm = () => {
        if (password && confirmPassword) {
            if (password !== confirmPassword) {
                WarningAlert('ผิดพลาด!', 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน');
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await fetch(`/api/user/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password })
            });

            if (!response.ok) throw new Error('เกิดข้อผิดพลาด');

            SuccessAlert('สำเร็จ!', 'ข้อมูลผู้ใช้ได้ถูกอัพเดตแล้ว');
            router.push('/admin/users_management');
        } catch (error) {
            console.error(error);
            WarningAlert('ผิดพลาด!', 'ไม่สามารถอัพเดตผู้ใช้ได้');
        }
    };

    const handleBack = () => {
        router.push('/admin/users_management');
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">แก้ไขข้อมูลผู้ใช้</h1>
            <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                <Card className="max-w-6xl mx-auto px-4 py-8 shadow-xl" >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                            <label htmlFor="password" className="block text-base font-medium mr-4 mb-4">
                                <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> รหัสผ่าน : </span>
                            </label>
                            <Input
                                placeholder="รหัสผ่าน"
                                name="password"
                                id="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="flex-grow mr-4"
                                style={{
                                    flexGrow: 1,
                                    flexShrink: 1,
                                    flexBasis: 'calc(100% - 150px)', // Adjust size based on label width
                                    padding: '8px',
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                <label htmlFor="confirmpassword" className="block text-base font-medium mr-4">
                                    <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> ยืนยันรหัสผ่าน : </span>
                                </label>
                                <Input
                                    placeholder="ยืนยันรหัสผ่าน"
                                    name="confirmpassword"
                                    id="confirmpassword"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="flex-grow mr-4"
                                    style={{
                                        flexGrow: 1,
                                        flexShrink: 1,
                                        flexBasis: 'calc(100% - 150px)', // Adjust size based on label width
                                        padding: '8px',
                                    }}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '102%', padding: '15px' }}>
                            <Button
                                className="inline-flex justify-center mr-4 mb-4"
                                type="primary"
                                size="middle"
                                onClick={handleSubmit}
                                style={{
                                    color: 'white',
                                    backgroundColor: '#02964F',
                                    borderColor: '#02964F',
                                }}
                            >
                                บันทึก
                            </Button>
                            <Button
                                className="inline-flex justify-center mr-4 mb-4"
                                onClick={handleBack}
                                size="middle"
                            >
                                ยกเลิก
                            </Button>
                        </div>
                    </div>
                </Card>
            </form>
        </div>
    );
};

export default EditPassUser;