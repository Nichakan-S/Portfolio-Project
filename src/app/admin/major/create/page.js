'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import { SuccessAlert, WarningAlert } from '../../../components/sweetalert';

const CreateMajor = () => {
    const [majorName, setMajorName] = useState('');
    const [faculty, setFaculty] = useState([]);
    const [selectedFaculty, setSelectedFaculty] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchfaculty = async () => {
            const response = await fetch('/api/faculty');
            const data = await response.json();
            setFaculty(data);
        };

        fetchfaculty();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFaculty) {
            WarningAlert('ผิดพลาด!', 'กรุณาเลือกคณะ');
            return;
        }
        try {
            const response = await fetch('/api/major', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ facultyId: selectedFaculty, majorName })
            });

            if (!response.ok) throw new Error('Something went wrong');

            SuccessAlert('สำเร็จ!', 'ข้อมูลได้ถูกบันทึกแล้ว');
            router.push('/admin/major');

        } catch (error) {
            console.error(error);
            WarningAlert('ผิดพลาด!', 'ไม่สามารถบันทึกข้อมูลได้');
        }
    };

    const handleBack = () => {
        router.push('/admin/major');
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">เพิ่มสาขาใหม่</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="faculty" className="block text-sm font-medium text-gray-700">
                        เลือกคณะ
                    </label>
                    <select
                        id="faculty"
                        required
                        value={selectedFaculty}
                        onChange={(e) => setSelectedFaculty(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="">กรุณาเลือกคณะ</option>
                        {faculty.map(faculty => (
                            <option key={faculty.id} value={faculty.id}>
                                {faculty.facultyName}
                            </option>
                        ))}
                    </select>
                    <label htmlFor="majorName" className="block text-sm font-medium text-gray-700 mt-4">
                        ชื่อสาขา
                    </label>
                    <input
                        type="text"
                        name="majorName"
                        id="majorName"
                        required
                        value={majorName}
                        onChange={(e) => setMajorName(e.target.value)}
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

export default CreateMajor;
