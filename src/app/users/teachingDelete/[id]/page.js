'use client'

import React, { useEffect, useState } from 'react'
import { SuccessAlert, WarningAlert, ConfirmAlert } from '../../../components/sweetalert';
import { Button, Input, Select, Modal } from 'antd';

const { Option } = Select;
const { confirm } = Modal;

const DayEnum = {
    mon: 'จันทร์',
    tue: 'อังคาร',
    wed: 'พุธ',
    thu: 'พฤหัสบดี',
    fri: 'ศุกร์',
    sat: 'เสาร์',
    sun: 'อาทิตย์',
};

const TeachingList = ({ params }) => {
    const [teaching, setTeaching] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [year, setYear] = useState('');
    const [term, setTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const { id } = params;

    const fetchteaching = async (id) => {
        try {
            const response = await fetch(`/api/userTeaching/${id}`);
            const data = await response.json();
            console.log('teaching data fetched:', data);
            setTeaching(data);
        } catch (error) {
            console.error('Failed to fetch teaching', error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (id) {
            fetchteaching(parseInt(id));
        }
    }, [id]);

    const handleDelete = async (id) => {
        ConfirmAlert('คุณแน่ใจที่จะลบข้อมูลนี้?', 'การดำเนินการนี้ไม่สามารถย้อนกลับได้', async () => {
            try {
                const response = await fetch(`/api/teaching/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error('Failed to delete the teaching.');
                SuccessAlert('ลบสำเร็จ!', 'ข้อมูลถูกลบแล้ว');
                setTeaching(teaching.filter(item => item.id !== id));
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

    const filteredteaching = teaching.filter((teaching) => {
        return (
            (!year || teaching.year.toString() === year) &&
            (!term || teaching.term.toString() === term) &&
            (
                teaching.subjects?.nameTH.toLowerCase().includes(searchTerm.toLowerCase()) ||
                teaching.subjects?.nameEN.toLowerCase().includes(searchTerm.toLowerCase()) ||
                teaching.subjects?.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                teaching.term.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                teaching.group.toLowerCase().includes(searchTerm.toLowerCase()) ||
                DayEnum[teaching.day].includes(searchTerm.toLowerCase()) ||
                teaching.starttime.toLowerCase().includes(searchTerm.toLowerCase()) ||
                teaching.endtime.toLowerCase().includes(searchTerm.toLowerCase()) ||
                teaching.year.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    });

    const uniqueYears = Array.from(new Set(teaching.map(t => t.year.toString())));

    return (
        <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold mb-6">ลบวิชาที่สอน</h1>
                <div className="flex items-center">
                    <Input
                        type="text"
                        placeholder="ค้นหาวิชาที่สอน..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow mr-2"
                    />
                    <Select
                        placeholder="เลือกปี"
                        value={year}
                        onChange={value => setYear(value)}
                        className="flex-grow mr-2 w-48"
                    >
                        <Select.Option value="all">ทั้งหมด</Select.Option>
                        {uniqueYears.map(year => (
                            <Select.Option key={year} value={year}>{year}</Select.Option>
                        ))}
                    </Select>
                    <Select
                        placeholder="เลือกเทอม"
                        value={term}
                        onChange={value => setTerm(value)}
                        className="flex-grow w-48"
                    >
                        <Select.Option value="all">ทั้งหมด</Select.Option>
                        <Select.Option value="1">เทอม 1</Select.Option>
                        <Select.Option value="2">เทอม 2</Select.Option>
                        <Select.Option value="3">เทอม 3</Select.Option>
                    </Select>
                </div>
            </div>
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full">
                    <thead className="bg-gray-50 ">
                        <tr>
                            <th scope="col" className="w-1 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                            <th scope="col" className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อวิชา</th>
                            <th scope="col" className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รหัสวิชา</th>
                            <th scope="col" className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">กลุ่มเรียน</th>
                            <th scope="col" className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่สอน</th>
                            <th scope="col" className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เวลาเริ่ม</th>
                            <th scope="col" className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เวลาจบ</th>
                            <th scope="col" className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เทอม</th>
                            <th scope="col" className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ปี</th>
                            <th scope="col" className="w-1/3 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ลบ</th>
                        </tr>
                    </thead>
                </table>
                <div className="max-h-96 overflow-y-auto">
                    <table className="min-w-full">
                        <tbody className="divide-y divide-gray-200">
                            {filteredteaching.length > 0 ? (
                                filteredteaching.map((teaching, index) => (
                                    <tr key={teaching.id}>
                                        <td className="w-1 px-6 py-4 whitespace-nowrap">
                                            {index + 1}
                                        </td>
                                        <td className="w-1/5 px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {teaching.subjects?.nameTH}
                                            </div>
                                        </td>
                                        <td className="w-1/5 px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {teaching.subjects?.code}
                                            </div>
                                        </td>
                                        <td className="w-1/5 px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {teaching.group}
                                            </div>
                                        </td>
                                        <td className="w-1/5 px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {DayEnum[teaching.day]}
                                            </div>
                                        </td>
                                        <td className="w-1/5 px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {teaching.starttime}
                                            </div>
                                        </td>
                                        <td className="w-1/5 px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {teaching.endtime}
                                            </div>
                                        </td>
                                         <td className="w-1/5 px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {teaching.term}
                                            </div>
                                        </td>
                                        <td className="w-1/5 px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {teaching.year}
                                            </div>
                                        </td>
                                        <td className="w-1/3 px-6 py-4 text-right whitespace-nowrap">
                                            <Button 
                                                type="link" 
                                                className="text-indigo-600 hover:text-indigo-900"
                                                onClick={() => handleDelete(teaching.id)}
                                            >
                                                ลบ
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10" className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        ไม่มีข้อมูล
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default TeachingList