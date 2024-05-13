'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SuccessAlert, WarningAlert} from '../../../../components/sweetalert';


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
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mt-4">
                        รหัสผ่าน
                    </label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="p-2 mt-1 block w-full h-12 rounded-lg border-gray-300 shadow-lg focus:border-indigo-500 focus:ring-indigo-500 text-lg"
                    />
                </div>
                <div>
                    <label htmlFor="confirmpassword" className="block text-sm font-medium text-gray-700 mt-4">
                        ยืนยันรหัสผ่าน
                    </label>
                    <input
                        type="password"
                        name="confirmpassword"
                        id="confirmpassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="p-2 mt-1 block w-full h-12 rounded-lg border-gray-300 shadow-lg focus:border-indigo-500 focus:ring-indigo-500 text-lg"
                    />
                </div>
                <button
                    type="submit"
                    className="mr-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    บันทึก
                </button>
                <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                    ยกเลิก
                </button>
            </form>
        </div>
    );
};

export default EditPassUser;