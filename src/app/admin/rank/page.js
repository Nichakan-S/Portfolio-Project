'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button, Input, Flex  } from 'antd';
import { EditFilled } from '@ant-design/icons';

const RankList = () => {
    const [rank, setRank] = useState([])
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchrank()
    }, [])

    const fetchrank = async () => {
        try {
            const res = await fetch('/api/rank')
            const data = await res.json()
            console.log('Rank data fetched:', data);
            setRank(data)
        } catch (error) {
            console.error('Failed to fetch rank', error)
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    const booleanText = (value) => {
        return value === true ? (
            <span className="text-green-800 bg-green-200 rounded px-2 py-1">
                เปิดใช้งาน
            </span>
        ) : (
            <span className="text-red-800 bg-red-200 rounded px-2 py-1">
                ปิดใช้งาน
            </span>
        );
    };
    const filteredrank = rank.filter((rank) =>
        rank.rankname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold mb-6">ตำแหน่ง</h1>
                <div className="flex items-center">
                    <Input 
                        className="flex-grow mr-2"
                        placeholder="ค้นหาตำแหน่ง..." 
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Flex align="flex-start" gap="small" vertical  >
                        <Link href="rank/create">
                            <Button type="primary" style={{ backgroundColor: '#2D427C', borderColor: '#2D427C', color: 'white' }}>เพิ่มตำแหน่ง</Button>
                        </Link>
                    </Flex>
                </div>
            </div>
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full">
                    <thead className="bg-gray-100 ">
                        <tr>
                            <th scope="col" className="w-1 px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">#</th>
                            <th scope="col" className="w-1/5 px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">ชื่อตำแหน่ง</th>
                            <th scope="col" className="w-1/5 px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">เข้าถึงหน้าพนักงาน</th>
                            <th scope="col" className="w-1/5 px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">เข้าถึงหน้าประเมิน</th>
                            <th scope="col" className="w-1/5 px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">เข้าถึงหน้าภาพรวม</th>
                            <th scope="col" className="w-1/3 px-6 py-3 text-right text-base font-medium text-gray-500 uppercase tracking-wider">แก้ไข</th>
                        </tr>
                    </thead>
                </table>
                <div className="max-h-96 overflow-y-auto">
                    <table className="min-w-full">
                        <tbody className="divide-y divide-gray-200">
                            {filteredrank.length > 0 ? (
                                filteredrank.map((rank, index) => (
                                    <tr key={rank.id}>
                                        <td className="w-1 px-6 py-4 whitespace-nowrap">
                                            {index + 1}
                                        </td>
                                        <td className="w-1/5 px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {rank.rankname}
                                            </div>
                                        </td>
                                        <td className="w-1/5 px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {booleanText(rank.employee)}
                                            </div>
                                        </td>
                                        <td className="w-1/5 px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {booleanText(rank.evaluation)}
                                            </div>
                                        </td>
                                        <td className="w-1/5 px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {booleanText(rank.overview)}
                                            </div>
                                        </td>
                                        <td className="w-1/3 px-6 py-4 text-right whitespace-nowrap">
                                            <Link href={`/admin/rank/${rank.id}`}>
                                                <Button 
                                                type="link" 
                                                icon={<EditFilled style={{ fontSize: '20px' }}/>}
                                                style={{ color: '#FFD758' }}
                                                />
                                            </Link>
                                            {/* <Link
                                                className="text-indigo-600 hover:text-indigo-900"
                                                href={`/admin/rank/${rank.id}`}
                                            >
                                                แก้ไข
                                            </Link> */}
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

export default RankList
