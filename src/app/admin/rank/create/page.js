'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'
import { SuccessAlert, WarningAlert } from '../../../components/sweetalert';

const CreateRank = () => {
    const [rankname, setRankName] = useState('');
    const [employeeAccess, setEmployeeAccess] = useState('disable');
    const [evaluationAccess, setEvaluationAccess] = useState('disable');
    const [overviewAccess, setOverviewAccess] = useState('disable');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const employeeBool = employeeAccess === 'enable';
        const evaluationBool = evaluationAccess === 'enable';
        const overviewBool = overviewAccess === 'enable';
        try {
            const response = await fetch('/api/rank', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rankname,
                    employee: employeeBool,
                    evaluation: evaluationBool,
                    overview: overviewBool })
            });

            if (!response.ok) throw new Error('Something went wrong');

            SuccessAlert('สำเร็จ!', 'ข้อมูลได้ถูกบันทึกแล้ว');
            router.push('/admin/rank');

        } catch (error) {
            console.error(error);
            WarningAlert('ผิดพลาด!', 'ไม่สามารถบันทึกข้อมูลได้');
        }
    };
    const handleBack = () => {
        router.push('/admin/rank');
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">เพิ่มตำแหน่งใหม่</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="rankname" className="block text-sm font-medium text-gray-700">
                        ชื่อตำแหน่ง
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
                        value={overviewAccess}
                        onChange={(e) => setOverviewAccess(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="disable">ปิดใช้งาน</option>
                        <option value="enable">เปิดใช้งาน</option>
                    </select>
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

export default CreateRank;
