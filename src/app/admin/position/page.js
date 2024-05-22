'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button, Input, Flex, Tag, Empty } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

const PositionList = () => {
    const [position, setposition] = useState([])
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchposition()
    }, [])

    const fetchposition = async () => {
        try {
            const res = await fetch('/api/position')
            const data = await res.json()
            console.log('position data fetched:', data);
            setposition(data)
        } catch (error) {
            console.error('Failed to fetch position', error)
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="mt-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            </div>
        );
    }

    const booleanText = (value) => {
        return value === true ? (
            <span className=" rounded px-2 py-1">
                <Tag
                    color="success"
                    style={{
                        fontSize: '16px',
                        minHeight: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }} >เปิดใช้งาน</Tag>
            </span>
        ) : (
            <span className=" rounded px-2 py-1">
                <Tag
                    color="error"
                    style={{
                        fontSize: '16px',
                        minHeight: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }} >ปิดใช้งาน</Tag>
            </span>
        );
    };
    const filteredposition = position.filter((position) =>
        position.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold mb-6" style={{ color: "#6C7AA3" }} >ตำแหน่ง</h1>
                <div className="flex items-center justify-between">
                    <style>
                        {`
                        .custom-input::placeholder {
                            color: #6C7AA3; /* กำหนดสีของ placeholder */
                        }
                        `}
                    </style>
                    <Input
                        className="flex-grow mr-2 p-1 text-base border rounded-xl custom-input"
                        placeholder="ค้นหาตำแหน่ง..."
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ borderColor: '#2D427C', fontSize: '14px' }}
                    />
                    <Flex align="flex-start" gap="small" vertical  >
                        <Link href="position/create">
                            <Button
                                className="text-base mr-4 w-full p-1 border rounded-xl "
                                style={{
                                    backgroundColor: '#2D427C',
                                    borderColor: '#2D427C',
                                    color: 'white',
                                    height: '35px',
                                    borderWidth: '2px',
                                    fontSize: '18px'
                                }}
                            >
                                เพิ่มตำแหน่ง
                            </Button>
                        </Link>
                    </Flex>
                </div>
            </div>
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full" style={{ lineHeight: '1.5' }}>
                    <thead
                        className="text-base rounded-lg border-b "
                        style={{
                            color: '#000000',
                            borderColor: '#2D427C',
                        }}>
                        <tr>
                            <th scope="col"
                                className="w-1 px-2 py-3 text-left  uppercase tracking-wider"
                                style={{ fontSize: '12px' }}
                            >#</th>
                            <th scope="col"
                                className="w-3/12 px-2 py-3 text-left  uppercase tracking-wider"
                                style={{ fontSize: '12px' }}
                            >ชื่อตำแหน่ง</th>
                            <th scope="col"
                                className="w-1/6 px-2 py-3 text-left  uppercase tracking-wider"
                                style={{ fontSize: '12px' }}
                            >ตรวจสอบ</th>
                            <th scope="col"
                                className="w-1/6 px-2 py-3 text-left  uppercase tracking-wider"
                                style={{ fontSize: '12px' }}
                            >สำรวจบุคลากร</th>
                            <th scope="col"
                                className="w-1/6 px-2 py-3 text-left  uppercase tracking-wider"
                                style={{ fontSize: '12px' }}
                            >อนุมัติกิจกรรม</th>
                            <th scope="col"
                                className="w-1/6 px-2 py-3 text-left  uppercase tracking-wider"
                                style={{ fontSize: '12px' }}
                            >อนุมัติวิจัย</th>
                            <th scope="col"
                                className="w-1/6 px-2 py-3 text-left  uppercase tracking-wider"
                                style={{ fontSize: '12px' }}
                            >กราฟผลงาน</th>
                            <th scope="col"
                                className="w-1/3 px-2 py-3 text-right  uppercase tracking-wider"
                                style={{ fontSize: '12px' }}
                            >แก้ไข</th>
                        </tr>
                    </thead>
                </table>
                <div className="max-h-96 overflow-y-auto">
                    <table className="min-w-full">
                        <tbody className="divide-y divide-gray-200" style={{ borderColor: '#2D427C' }} >
                            {filteredposition.length > 0 ? (
                                filteredposition.map((position, index) => (
                                    <tr key={position.id}>
                                        <td className="w-1 px-4 whitespace-nowrap">
                                            {index + 1}
                                        </td>
                                        <td className="w-3/12 px-4 whitespace-nowrap max-w-6 text-sm">
                                            {position.name}
                                        </td>
                                        <td className="w-2/12 px-4 whitespace-nowrap">
                                            {booleanText(position.audit)}
                                        </td>
                                        <td className="w-2/12 px-4 whitespace-nowrap">
                                            {booleanText(position.employee)}
                                        </td>
                                        <td className="w-2/12 px-4 whitespace-nowrap">
                                            {booleanText(position.approveActivity)}
                                        </td>
                                        <td className="w-2/12 px-4 whitespace-nowrap">
                                            {booleanText(position.approveResearch)}
                                        </td>
                                        <td className="w-2/12 px-4 whitespace-nowrap">
                                            {booleanText(position.overview)}
                                        </td>
                                        <td className="w-1/3 px-4 text-right whitespace-nowrap">
                                            <Link href={`/admin/position/${position.id}`}>
                                                <Button
                                                    type="link"
                                                    icon={<FontAwesomeIcon icon={faPen} style={{ fontSize: '16px', color: '#FFD758' }} />}
                                                />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        <Empty />
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

export default PositionList
