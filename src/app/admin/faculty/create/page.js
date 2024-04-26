'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'
import { SuccessAlert, WarningAlert } from '../../../components/sweetalert';

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
                    <label htmlFor="facultyName" className="block text-sm font-medium text-gray-700">
                        ชื่อคณะ
                    </label>
                    <input
                        type="text"
                        name="facultyName"
                        id="facultyName"
                        required
                        value={facultyName}
                        onChange={(e) => setFacultyName(e.target.value)}
                        className="p-2 mt-1 block w-full h-12 rounded-lg border-gray-300 shadow-lg focus:border-indigo-500 focus:ring-indigo-500 text-lg"
                    />
                </div>
                <div>
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
                </div>
            </form>
        </div>
    );
};

export default CreateFaculty;
