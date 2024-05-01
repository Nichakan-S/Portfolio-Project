'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'
import { SuccessAlert, WarningAlert } from '../../../components/sweetalert';
import { Input , Select } from 'antd';

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

    const EmployeehandleChange = (value) => {
        setEmployeeAccess(value);
    };

    const OverviewhandleChange = (value) => {
        setOverviewAccess(value);
    };

    const EvaluationhandleChange = (value) => {
        setEvaluationAccess(value);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">เพิ่มตำแหน่งใหม่</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="rankname" className="block text-base font-medium text-gray-700 mb-4 ">
                        ชื่อตำแหน่ง
                    </label>
                    <Input 
                        placeholder="rankname" 
                        size="large"
                        type="text"
                        name="rankname"
                        id="rankname"
                        required
                        value={rankname}
                        onChange={(e) => setRankName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="employeeAccess" className="block text-sm font-medium text-gray-700 mb-4">
                        เข้าถึงหน้าพนักงาน
                    </label>
                    <Select
                        defaultValue="enable" // ตั้งค่าเริ่มต้นที่ต้องการ
                        style={{ width: '100%' }} // ใช้ '100%' เพื่อให้แมทช์กับตัวเลือกเดิมที่ใช้ width: 'full'
                        onChange={EmployeehandleChange}
                        options={[
                            { value: 'disable', label: 'ปิดใช้งาน' },
                            { value: 'enable', label: 'เปิดใช้งาน' }
                        ]}
                    />

                </div>
                <div>
                    <label htmlFor="evaluationAccess" className="block text-sm font-medium text-gray-700 mb-4">
                        เข้าถึงหน้าประเมิน
                    </label>
                    <Select
                        defaultValue="enable" // ตั้งค่าเริ่มต้นให้ตรงกับ state ปัจจุบัน
                        style={{ width: '100%' }} // ใช้ '100%' เพื่อให้แมทช์กับตัวเลือกเดิมที่ใช้ width: 'full'
                        onChange={EvaluationhandleChange}
                        options={[
                            { value: 'disable', label: 'ปิดใช้งาน' ,color: '#ff0000'},
                            { value: 'enable', label: 'เปิดใช้งาน' }
                        ]}
                    />
                </div>
                <div>
                    <label htmlFor="overviewAccess" className="block text-sm font-medium text-gray-700 mb-4">
                        เข้าถึงหน้าภาพรวม
                    </label>
                    <Select
                        defaultValue="enable" // ตั้งค่าเริ่มต้นให้ตรงกับ state ปัจจุบัน
                        style={{ width: '100%' }} // ใช้ '100%' เพื่อให้แมทช์กับตัวเลือกเดิมที่ใช้ width: 'full'
                        onChange={OverviewhandleChange}
                        options={[
                            { value: 'disable', label: 'ปิดใช้งาน' },
                            { value: 'enable', label: 'เปิดใช้งาน' }
                        ]}
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

export default CreateRank;
