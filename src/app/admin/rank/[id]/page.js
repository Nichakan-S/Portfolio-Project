'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SuccessAlert, WarningAlert, ConfirmAlert } from '../../../components/sweetalert';


const EditRank = ({ params }) => {
    const [rankname, setRankName] = useState('');
    const [employeeAccess, setEmployeeAccess] = useState('');
    const [evaluationAccess, setEvaluationAccess] = useState('');
    const [overviewAccess, setOverviewAccess] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const { id } = params;


    const fetchRank = async (id) => {
        try {
            const response = await fetch(`/api/rank/${id}`);
            const data = await response.json();
            if (!response.ok) throw new Error('Failed to fetch rank data');

            setRankName(data.rankname);
            setEmployeeAccess(data.employee ? 'enable' : 'disable');
            setEvaluationAccess(data.evaluation ? 'enable' : 'disable');
            setOverviewAccess(data.overview ? 'enable' : 'disable');
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchRank(parseInt(id));
        }
        if (rankname) {
            fetchRank(parseInt(rankname));
        }
    }, [id], [rankname]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Convert string values 'enable'/'disable' to boolean
        const employeeBool = employeeAccess === 'enable';
        const evaluationBool = evaluationAccess === 'enable';
        const overviewBool = overviewAccess === 'enable';

        try {
            const response = await fetch(`/api/rank/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rankname,
                    employee: employeeBool,
                    evaluation: evaluationBool,
                    overview: overviewBool
                }),
            });

            if (!response.ok) throw new Error('Failed to update rank');

            SuccessAlert('สำเร็จ!', 'ข้อมูลถูกอัปเดตเรียบร้อยแล้ว');
            router.push('/admin/rank');
        } catch (error) {
            console.error(error);
            WarningAlert('ผิดพลาด!', 'ไม่สามารถอัปเดตข้อมูลได้');
        }
    };

    const handleDelete = async () => {
        ConfirmAlert('คุณแน่ใจที่จะลบข้อมูลนี้?', 'การดำเนินการนี้ไม่สามารถย้อนกลับได้', async () => {
            try {
                const response = await fetch(`/api/rank/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error('Failed to delete the Rank.');
                SuccessAlert('ลบสำเร็จ!', 'ข้อมูลถูกลบแล้ว');
                router.push('/admin/rank');
            } catch (error) {
                console.error('Failed to delete the Rank', error);
                WarningAlert('ผิดพลาด!', 'ไม่สามารถลบข้อมูลได้');
            }
        });
    };
    const handleBack = () => {
        router.push('/admin/rank');
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">แก้ไขชื่อคณะ{rankname}</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label
                        htmlFor="rankname"
                        className="block text-sm font-medium text-gray-700"
                    >
                        ชื่อคณะ
                    </label>
                    <input
                        type="text"
                        name="rankname"
                        id="rankname"
                        required
                        value={rankname}
                        onChange={(e) => setRankName(e.target.value)}
                        className="p-2 mt-1 block w-full h-12 rounded-lg border-gray-300 shadow-lg focus:border-indigo-500 focus:ring-indigo-500 text-lg"
                    />
                </div>
                <div>
                    <label htmlFor="employeeAccess" className="block text-sm font-medium text-gray-700">
                        เข้าถึงหน้าพนักงาน
                    </label>
                    <select
                        id="employeeAccess"
                        required
                        value={employeeAccess}
                        onChange={(e) => setEmployeeAccess(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="disable">ปิดใช้งาน</option>
                        <option value="enable">เปิดใช้งาน</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="evaluationAccess" className="block text-sm font-medium text-gray-700">
                        เข้าถึงหน้าประเมิน
                    </label>
                    <select
                        id="evaluationAccess"
                        required
                        value={evaluationAccess}
                        onChange={(e) => setEvaluationAccess(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="disable">ปิดใช้งาน</option>
                        <option value="enable">เปิดใช้งาน</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="overviewAccess" className="block text-sm font-medium text-gray-700">
                        เข้าถึงหน้าภาพรวม
                    </label>
                    <select
                        id="overviewAccess"
                        required
                        value={overviewAccess}
                        onChange={(e) => setOverviewAccess(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="disable">ปิดใช้งาน</option>
                        <option value="enable">เปิดใช้งาน</option>
                    </select>
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

export default EditRank;
