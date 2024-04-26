'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SuccessAlert, WarningAlert, ConfirmAlert } from '../../../components/sweetalert';


const EditMajor = ({ params }) => {
    const [majorName, setMajorName] = useState('');
    const [faculty, setFaculty] = useState([]);
    const [selectedFaculty, setSelectedFaculty] = useState('');
    const router = useRouter();
    const { id } = params;
    const [isLoading, setIsLoading] = useState(true);

    const fetchMajor = async (id) => {
        try {
            const response = await fetch(`/api/major/${id}`);
            const data = await response.json();
            if (!response.ok) throw new Error('Failed to fetch Major');
            setMajorName(data.majorName);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchFacultyAndMajor = async () => {
            try {
                const majorResponse = await fetch(`/api/major/${id}`);
                const majorData = await majorResponse.json();
                if (!majorResponse.ok) throw new Error('Failed to fetch major');
                setMajorName(majorData.majorName);
                setSelectedFaculty(majorData.facultyId);

                const facultyResponse = await fetch('/api/faculty');
                const facultyData = await facultyResponse.json();
                setFaculty(facultyData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchFacultyAndMajor();
    }, [id]);

    useEffect(() => {
        if (id) {
            fetchMajor(parseInt(id));
        }
        if (majorName) {
            fetchMajor(parseInt(majorName));
        }
    }, [id], [majorName]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // แปลง selectedFaculty จาก string เป็น integer
            const facultyIdAsNumber = parseInt(selectedFaculty);
            if (isNaN(facultyIdAsNumber)) {
                throw new Error('Invalid faculty ID');
            }
            const response = await fetch(`/api/major/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    facultyId: facultyIdAsNumber, majorName,
                }),
            });

            if (!response.ok) throw new Error('Failed to update Major');
            SuccessAlert('สำเร็จ!', 'ข้อมูลถูกอัปเดตเรียบร้อยแล้ว');
            router.push('/admin/major');
        } catch (error) {
            console.error(error);
            WarningAlert('ผิดพลาด!', 'ไม่สามารถบันทึกข้อมูลได้');
        }
    };

    const handleDelete = async () => {
        ConfirmAlert('คุณแน่ใจที่จะลบข้อมูลนี้?', 'การดำเนินการนี้ไม่สามารถย้อนกลับได้', async () => {
            try {
                const response = await fetch(`/api/major/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error('Failed to delete the major.');
                // Redirect after successful deletion
                SuccessAlert('ลบสำเร็จ!', 'ข้อมูลถูกลบแล้ว');
                router.push('/admin/major');
            } catch (error) {
                console.error('Failed to delete the major', error);
                WarningAlert('ผิดพลาด!', 'ไม่สามารถลบข้อมูลได้');
            }
        });
    };

    const handleBack = () => {
        router.push('/admin/major');
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">แก้ไขชื่อสาขา{majorName}</h1>
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
                        {faculty.map((fac) => (
                            <option key={fac.id} value={fac.id}>
                                {fac.facultyName}
                            </option>
                        ))}
                    </select>
                    <label
                        htmlFor="majorName"
                        className="block text-sm font-medium text-gray-700"
                    >
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
                <div className="flex items-center">
                    <button
                        type="submit"
                        className="mr-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        บันทึก
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="mr-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        ลบ
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

export default EditMajor;
