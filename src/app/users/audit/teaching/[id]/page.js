'use client'

import React, { useEffect, useState } from 'react';
import { Button, Input, Select } from 'antd';
import { SuccessAlert, WarningAlert, EvaluationAlert } from '../../../../components/sweetalert';

const audit = {
    wait: 'รอตรวจ',
    pass: 'ผ่าน',
    fail: 'ไม่ผ่าน'
};

const TeachingList = ({ params }) => {
    const { id } = params;
    const [teaching, setTeaching] = useState([]);
    const [selectTerm, setSelectTerm] = useState('all');
    const [inputTerm, setInputTerm] = useState('');
    const [year, setYear] = useState('all');
    const [term, setTerm] = useState('all');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchteaching(Number(params.id));
    }, [params.id]);

    const fetchteaching = async (id) => {
        if (isNaN(id)) {
            console.error('Invalid majorId:', id);
            setIsLoading(false);
            return;
        }
        try {
            const res = await fetch(`/api/auditTeaching/${id}`);
            if (!res.ok) {
                const errorDetails = await res.json();
                throw new Error(errorDetails.details || 'Unknown error occurred');
            }
            const data = await res.json();
            console.log('teaching data fetched:', data);
            setTeaching(data);
        } catch (error) {
            console.error('Failed to fetch teaching:', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (audit, id) => {
        EvaluationAlert('ยืนยันการประเมิน', 'คุณแน่ใจหรือไม่ที่จะทำการประเมินผลงานนี้?')
            .then(async (result) => {
                if (result.isConfirmed) {
                    console.log(audit, id);
                    try {
                        const response = await fetch(`/api/auditTeaching/${id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ audit })
                        });
                        if (!response.ok) throw new Error('Something went wrong');
                        SuccessAlert('สำเร็จ!', 'ข้อมูลได้ถูกประเมินแล้ว');
                        fetchteaching(params.id);
                    } catch (error) {
                        console.error(error);
                        WarningAlert('ผิดพลาด!', 'ไม่สามารถประเมินข้อมูลได้');
                    }
                }
            }).catch((error) => {
                console.error('Promise error:', error);
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

    const filteredteaching = Array.isArray(teaching) ? teaching.filter((teaching) => {
        return (
            (selectTerm === 'all' || audit[teaching.audit] === selectTerm) &&
            (year === 'all' || teaching.year.toString() === year) &&
            (term === 'all' || teaching.term.toString() === term) &&
            (
                teaching.subjects?.nameTH.toLowerCase().includes(inputTerm.toLowerCase()) ||
                teaching.subjects?.nameEN.toLowerCase().includes(inputTerm.toLowerCase()) ||
                teaching.subjects?.code.toLowerCase().includes(inputTerm.toLowerCase()) ||
                teaching.term.toString().toLowerCase().includes(inputTerm.toLowerCase()) ||
                teaching.group.toLowerCase().includes(inputTerm.toLowerCase()) ||
                teaching.year.toString().toLowerCase().includes(inputTerm.toLowerCase())
            )
        );
    }) : [];

    const uniqueYears = Array.from(new Set(teaching.map(t => t.year.toString())));

    return (
        <div className="max-w-6xl mx-auto px-4 mt-2">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold mb-6">ตรวจสอบการสอน</h1>
                <div className="flex items-center">
                    <Input
                        type="text"
                        placeholder="ค้นหาผลงานกิจกรรม..."
                        value={inputTerm}
                        onChange={(e) => setInputTerm(e.target.value)}
                        className="flex-grow mr-2"
                    />
                    <Select
                        value={selectTerm}
                        onChange={(value) => setSelectTerm(value)}
                        className="flex-grow mr-2 w-48"
                        options={[
                            { value: 'all', label: 'ทั้งหมด' },
                            { value: 'รอ', label: 'รอ' },
                            { value: 'ผ่าน', label: 'ผ่าน' },
                            { value: 'ไม่ผ่าน', label: 'ไม่ผ่าน' }
                        ]}
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
                            <th scope="col" className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รหัสวิชา</th>
                            <th scope="col" className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อวิชา</th>
                            <th scope="col" className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เทอม</th>
                            <th scope="col" className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ปี</th>
                            <th scope="col" className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อผู้สอน</th>
                            <th scope="col" className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                            <th scope="col" className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ตรวจสอบ</th>
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
                                                {teaching.subjects?.code}
                                            </div>
                                        </td>
                                        <td className="w-1/5 px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {teaching.subjects?.nameTH}
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
                                        
                                        <td className="w-1/5 px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {teaching.user?.username}
                                            </div>
                                        </td>
                                        <td className="w-1/5 px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {audit[teaching.audit]}
                                            </div>
                                        </td>
                                        <td className="w-1/5 px-6 py-4 whitespace-nowrap">
                                            <Button
                                                type="primary"
                                                className="mr-2"
                                                style={{ backgroundColor: '#02964F', borderColor: '#02964F' }}
                                                onClick={() => handleSubmit('pass', teaching.id)}
                                            >
                                                ผ่าน
                                            </Button>
                                            <Button
                                                type="primary"
                                                danger
                                                className="mr-2"
                                                style={{ backgroundColor: '#E50000', borderColor: '#E50000' }}
                                                onClick={() => handleSubmit('fail', teaching.id)}
                                            >
                                                ไม่ผ่าน
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
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

export default TeachingList;
