'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button, Input, Flex  } from 'antd';
import { EditFilled } from '@ant-design/icons';

const MajorList = () => {
    const [major, setMajor] = useState([])
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchMajor()
    }, [])

    const fetchMajor = async () => {
        try {
            const res = await fetch('/api/major')
            const data = await res.json()
            setMajor(data)
        } catch (error) {
            console.error('Failed to fetch major', error)
        } finally {
            setIsLoading(false);
        }
    }
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    const filteredmajor = major.filter((major) => {
        return major.majorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            major.faculty?.facultyName.toLowerCase().includes(searchTerm.toLowerCase());
    });


    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold mb-6">สาขา</h1>
                <div className="flex items-center">
                    <Input 
                        className="flex-grow mr-2"
                        placeholder="ค้นหาสาขา..." 
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Flex align="flex-start" gap="small" vertical  >
                        <Link href="major/create">
                        <Button type="primary" style={{ backgroundColor: '#2D427C', borderColor: '#2D427C', color: 'white' }}>เพิ่มสาขา</Button>
                        </Link>
                    </Flex>
                </div>
            </div>
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full">
                    <thead className="bg-gray-100 ">
                        <tr>
                            <th scope="col" className="w-1 px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">#</th>
                            <th scope="col" className="w-1/5 px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">ชื่อสาขา</th>
                            <th scope="col" className="w-1/5 px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">ชื่อคณะ</th>
                            <th scope="col" className="px-6 py-3 text-right text-base font-medium text-gray-500 uppercase tracking-wider">แก้ไข</th>
                        </tr>
                    </thead>
                </table>
                <div className="max-h-96 overflow-y-auto">
                    <table className="min-w-full">
                        <tbody className="divide-y divide-gray-200">
                            {filteredmajor.length > 0 ? (
                                filteredmajor.map((major, index) => (
                                    <tr key={major.id}>
                                        <td className="w-1 px-6 py-4 whitespace-nowrap">
                                            {index + 1}
                                        </td>
                                        <td className="w-1/5 px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {major.majorName}
                                            </div>
                                        </td>
                                        <td className="w-1/5 px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {major.faculty?.facultyName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <Link href={`/admin/major/${major.id}`}>
                                                <Button 
                                                    type="link" 
                                                    icon={<EditFilled style={{ fontSize: '20px' }}/>}
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
        </div >
    )
}

export default MajorList
