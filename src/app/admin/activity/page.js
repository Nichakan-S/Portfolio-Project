'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, Input, Flex, Modal } from 'antd';
import { EditFilled } from '@ant-design/icons';

const ActivityList = () => {
    const [activity, setActivity] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState('');

    useEffect(() => {
        fetchActivity();
    }, []);

    useEffect(() => {
        console.log(modalContent);
    }, [modalContent]);

    const fetchActivity = async () => {
        try {
            const res = await fetch('/api/activity');
            const data = await res.json();
            setActivity(data);
        } catch (error) {
            console.error('Failed to fetch Activity', error);
        } finally {
            setIsLoading(false);
        }
    };

    const showModal = (file) => {
        setModalContent(file);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    const filteredActivity = activity.filter((activity) => {
        return activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            activity.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            activity.start.toLowerCase().includes(searchTerm.toLowerCase()) ||
            activity.year.toLowerCase().includes(searchTerm.toLowerCase()) ||
            activity.file.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold mb-6">กิจกรรม</h1>
                <div className="flex items-center justify-between">
                    <Input
                        className="flex-grow mr-2 p-2 text-base border rounded-lg"
                        placeholder="ค้นหากิจกรรม..."
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Flex align="flex-start" gap="small" vertical  >
                        <Link href="activity/create">
                            <Button
                                className="text-base mr-2 w-full p-2 border rounded-lg h-10"
                                style={{
                                    backgroundColor: '#2D427C',
                                    borderColor: '#2D427C',
                                    color: 'white',
                                }}
                            >
                                เพิ่มกิจกรรม
                            </Button>
                        </Link>
                    </Flex>
                </div>
            </div>
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg ">
                <table className="min-w-full">
                    <thead className="bg-[#274381]" >
                        <tr>
                            <th scope="col" className="w-1 px-6 py-5 text-left text-base font-medium text-gray-500 uppercase tracking-wider">#</th>
                            <th scope="col" className="px-9 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">ชื่อกิจกรรม</th>
                            <th scope="col" className="px-9 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">ประเภท</th>
                            <th scope="col" className="px-9 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">เวลาเริ่ม</th>
                            <th scope="col" className="px-9 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">เวลาจบ</th>
                            <th scope="col" className="px-9 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">ปี</th>
                            <th scope="col" className="px-6 py-3 text-right text-base font-medium text-gray-500 uppercase tracking-wider">แก้ไข</th>
                            <th scope="col" className="px-6 py-3 text-right text-base font-medium text-gray-500 uppercase tracking-wider">ไฟล์</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredActivity.map((activity, index) => (
                            <tr key={activity.id}>
                                <td className="w-1 px-6 py-4 whitespace-nowrap">
                                    {index + 1}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {activity.name}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {activity.type}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {activity.start}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {activity.end}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {activity.year}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <Button
                                        onClick={() => showModal(activity.file)}
                                        type="link"
                                        style={{ color: '#FFD758' }}
                                    >
                                        เปิดไฟล์
                                    </Button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <Link href={`/admin/activity/${activity.id}`}>
                                        <Button
                                            type="link"
                                            icon={<EditFilled style={{ fontSize: '20px' }} />}
                                            style={{ color: '#FFD758' }}
                                        />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal
                title="Preview File"
                open={isModalVisible}
                onCancel={closeModal}
                footer={[]}
                width="70%"
                style={{ top: 20 }}
            >
                {modalContent ? (
                    <embed src={`data:application/pdf;base64,${modalContent}`} type="application/pdf" style={{ width: '100%', height: '75vh' }} />
                ) : (
                    <p>Error displaying the document. Please try again.</p>
                )}
            </Modal>

        </div>
    );
}

export default ActivityList;

