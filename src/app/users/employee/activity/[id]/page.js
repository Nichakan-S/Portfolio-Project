'use client'

import React, { useEffect, useState } from 'react'
import { Button, Input, Modal } from 'antd';

const Status = {
    wait: 'รอตรวจ',
    pass: 'ผ่าน',
    fail: 'ไม่ผ่าน'
};

const ActivityList = ({ params }) => {
    const [username, setUsername] = useState('');
    const [activity, setActivity] = useState([])
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const { id } = params;

    const fetchactivity = async (id) => {
        try {
            const response = await fetch(`/api/userActivity/${id}`)
            const data = await response.json()
            console.log('activity data fetched:', data);
            setActivity(data)
            setUsername(data[0]?.user?.username);
        } catch (error) {
            console.error('Failed to fetch activity', error)
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (id) {
            fetchactivity(parseInt(id));
        }
    }, [id]);

    const showModal = (file) => {
        setModalContent(file);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const handleBack = () => {
        window.history.back();
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    const filteredactivity = activity.filter((activity) => {
        return activity.activity?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            activity.activity?.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            activity.activity?.year.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            Status[activity.status].includes(searchTerm.toLowerCase());
    });

    return (
        <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold mb-6">ผลงานกิจกรรมของ{username}</h1>
                <div className="flex items-center">
                    <Input
                        type="text"
                        placeholder="ค้นหาผลงานกิจกรรม..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow mr-2"
                    />
                </div>
            </div>
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full">
                    <thead className="bg-gray-50 ">
                        <tr>
                            <th scope="col" className="w-1 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                            <th scope="col" className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อกิจกรรม</th>
                            <th scope="col" className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ประเภท</th>
                            <th scope="col" className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ปี</th>
                            <th scope="col" className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ไฟล์</th>
                            <th scope="col" className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                        </tr>
                    </thead>
                </table>
                <div className="max-h-96 overflow-y-auto">
                    <table className="min-w-full">
                        <tbody className="divide-y divide-gray-200">
                            {filteredactivity.length > 0 ? (
                                filteredactivity.map((activity, index) => (
                                    <tr key={activity.id}>
                                        <td className="w-1 px-6 py-4 whitespace-nowrap">
                                            {index + 1}
                                        </td>
                                        <td className="w-1/5 px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {activity.activity?.name}
                                            </div>
                                        </td>
                                        <td className="w-1/5 px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {activity.activity?.type === 'culture' ? 'ศิลปะวัฒนธรรม' : 'บริการวิชาการ'}
                                            </div>
                                        </td>
                                        <td className="w-1/5 px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {activity.activity?.year}
                                            </div>
                                        </td>
                                        <td className="w-1/5 px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {Status[activity.status]}
                                            </div>
                                        </td>
                                        <td className="w-1/5 px-6 py-4 whitespace-nowrap">
                                            <Button
                                                onClick={() => showModal(activity.file)}
                                                type="link"
                                                style={{ color: '#FFD758' }}
                                            >
                                                เปิดไฟล์
                                            </Button>
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
                <Modal
                    title="Preview File"
                    open={isModalVisible}
                    onCancel={closeModal}
                    footer={[
                        <Button key="download" type="primary" href={modalContent} target="_blank" download>
                            ดาวน์โหลด PDF
                        </Button>,
                        <Button key="cancel" onClick={closeModal}>
                            ยกเลิก
                        </Button>
                    ]}
                    width="70%"
                    style={{ top: 20 }}
                >
                    {modalContent ? (
                        <iframe src={`${modalContent}`} loading="lazy" style={{ width: '100%', height: '75vh' }}></iframe>
                    ) : (
                        <p>Error displaying the document. Please try again.</p>
                    )}
                </Modal>
            </div>
            <div>
                <Button className="inline-flex justify-center mt-4"
                    onClick={handleBack}
                >
                    ย้อนกลับ
                </Button>
            </div>
        </div>
    )
}

export default ActivityList
