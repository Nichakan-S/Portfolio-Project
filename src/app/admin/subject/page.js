'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button, Input, Flex } from 'antd';
import { EditFilled } from '@ant-design/icons';

const SubjectList = () => {
    const [subject, setSubject] = useState([])
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchsubject()
    }, [])

    const fetchsubject = async () => {
        try {
            const res = await fetch('/api/subject');
            const data = await res.json();
            setSubject(data);
        } catch (error) {
            console.error('Failed to fetch subject', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    const filteredsubject = subject.filter((subject) => {
        return subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               subject.day.toLowerCase().includes(searchTerm.toLowerCase()) ||
               subject.group.toLowerCase().includes(searchTerm.toLowerCase()) ||
               subject.starttime.toLowerCase().includes(searchTerm.toLowerCase()) ||
               subject.endtime.toLowerCase().includes(searchTerm.toLowerCase()) ||
               subject.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
               subject.year.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold mb-6">วิชา</h1>
                <div className="flex items-center justify-between">
                    <Input
                        className="flex-grow mr-2"
                        placeholder="ค้นหาวิชา..."
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Flex align="flex-start" gap="small" vertical  >
                        <Link href="subject/create">
                            <Button type="primary" style={{ backgroundColor: '#2D427C', borderColor: '#2D427C', color: 'white' }}>เพิ่มวิชา</Button>
                        </Link>
                    </Flex>
                </div>
            </div>
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full">
                    <thead className="bg-gray-100 ">
                        <tr>
                            <th scope="col" className="w-1 px-6 py-5 text-left text-base font-medium text-gray-500 uppercase tracking-wider">#</th>
                            <th scope="col" className="px-9 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">ชื่อวิชา</th>
                            <th scope="col" className="px-9 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">วันสอน</th>
                            <th scope="col" className="px-9 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">กลุ่มเรียน</th>
                            <th scope="col" className="px-9 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">เวลาเริ่ม</th>
                            <th scope="col" className="px-9 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">เวลาจบ</th>
                            <th scope="col" className="px-9 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">เทอม</th>
                            <th scope="col" className="px-9 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">ปีการศึกษา</th>
                            <th scope="col" className="px-6 py-3 text-right text-base font-medium text-gray-500 uppercase tracking-wider">แก้ไข</th>
                        </tr>
                    </thead>
                </table>
                <div className="max-h-96 overflow-y-auto">
                    <table className="min-w-full">
                        <tbody className="divide-y divide-gray-200">
                            {filteredsubject.length > 0 ? (
                                filteredsubject.map((subject, index) => (
                                    <tr key={subject.id}>
                                        <td className="w-1 px-6 py-4 whitespace-nowrap">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {subject.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {subject.day}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {subject.group}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {subject.starttime}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {subject.endtime}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {subject.term}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {subject.year}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <Link href={`/admin/subject/${subject.id}`}>
                                                <Button
                                                    type="link"
                                                    icon={<EditFilled style={{ fontSize: '20px' }} />}
                                                    style={{ color: '#FFD758' }}
                                                />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
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

export default SubjectList
