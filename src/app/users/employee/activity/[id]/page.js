'use client'

import React, { useEffect, useState } from 'react'
import { Button, Modal, Descriptions, Card, Tag } from 'antd';
import SearchInput from '/src/app/components/SearchInputAll.jsx';

const Status = {
    wait: 'รอตรวจ',
    pass: 'ผ่าน',
    fail: 'ไม่ผ่าน'
};

const StatusColors = {
    wait: 'geekblue',
    pass: 'green',
    fail: 'red'
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
        return (
            <div className="flex justify-center items-center h-full">
                <div className="mt-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            </div>
        );
    }

    const filteredActivity = activity.filter((activity) => {
        return activity.activity?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            activity.activity?.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            activity.activity?.year.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            Status[activity.audit].includes(searchTerm.toLowerCase()) ||
            Status[activity.approve].includes(searchTerm.toLowerCase());
    });

    return (
        <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold mb-6" style={{ color: '#2D427C' }}>ผลงานกิจกรรม {username} </h1>
                    <SearchInput
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="ค้นหาผลงานกิจกรรม..."
                    />
            </div>
            <div style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                {filteredActivity.length > 0 ? (
                    filteredActivity.map((activity, index) => (
                        <Card
                            key={activity.id}
                            className="max-w-6xl mx-auto px-4 py-6 shadow-xl small-card"
                            style={{ headerHeight: '38px' }}
                            title={`กิจกรรม: ${activity.activity?.name}`}
                        >
                            <Descriptions layout="horizontal" size="small" className="small-descriptions">
                                <Descriptions.Item label="ประเภท">{activity.activity?.type === 'culture' ? 'ศิลปะวัฒนธรรม' : 'บริการวิชาการ'}</Descriptions.Item>
                                <Descriptions.Item label="ปี">{activity.activity?.year}</Descriptions.Item>
                                <Descriptions.Item label="ตรวจสอบ"><Tag color={StatusColors[activity.audit]}>{Status[activity.audit]}</Tag></Descriptions.Item>
                                <Descriptions.Item label="อนุมัติ"><Tag color={StatusColors[activity.approve]}>{Status[activity.approve]}</Tag></Descriptions.Item>
                                <Descriptions.Item label="ไฟล์">
                                    <Button
                                        type="link"
                                        onClick={() => showModal(activity.file)}
                                        style={{ color: '#FFD758' }}
                                    >
                                        เปิดไฟล์
                                    </Button>
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>
                    ))
                ) : (
                    <div className="text-center text-sm font-medium">ไม่มีข้อมูล</div>
                )}
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
            <div className="flex justify-end">
                <Button className="inline-flex justify-center mt-4"
                    onClick={handleBack}
                >
                    ย้อนกลับ
                </Button>
            </div>
        </div>
    );
};

export default ActivityList;
