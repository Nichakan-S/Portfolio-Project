'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'
import { SuccessAlert, WarningAlert } from '../../../components/sweetalert';
import { Input , Button} from 'antd';

const CreateFaculty = () => {
    const [facultyName, setFacultyName] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/faculty', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ facultyName })
            });

            if (!response.ok) throw new Error('Something went wrong');

            SuccessAlert('สำเร็จ!', 'ข้อมูลได้ถูกบันทึกแล้ว');
            router.push('/admin/faculty');

        } catch (error) {
            console.error(error);
            WarningAlert('ผิดพลาด!', 'ไม่สามารถบันทึกข้อมูลได้');
        }
    };
    const handleBack = () => {
        router.push('/admin/faculty');
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">เพิ่มคณะใหม่</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="facultyName" className="block text-base font-medium text-gray-700 mb-4">
                        ชื่อคณะ
                    </label>
                    <Input 
                        placeholder="facultyName" 
                        size="large"
                        type="text"
                        name="facultyName"
                        id="facultyName"
                        required
                        value={facultyName}
                        onChange={(e) => setFacultyName(e.target.value)}
                    />
                </div>
                <div>
                    <Button className="inline-flex justify-center mr-4 "
                        type="primary"
                        size="middle"
                        onClick={handleSubmit}
                        style={{ backgroundColor: '#00B96B', borderColor: '#00B96B' }}
                        >
                        บันทึก
                    </Button>
                    <Button className="inline-flex justify-center mr-4"
                        onClick={handleBack}
                        >
                        ยกเลิก
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateFaculty;
