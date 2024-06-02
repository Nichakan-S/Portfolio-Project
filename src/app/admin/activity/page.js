'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, Descriptions, Tag, Button, Modal } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import SearchInput from '/src/app/components/SearchInputAll.jsx';
import '/src/app/globals.css';

const Status = {
    wait: 'รอตรวจ',
    pass: 'ผ่าน',
    fail: 'ไม่ผ่าน'
};

const Type = {
    culture: 'วัฒนธรรม',
    service: 'บริการวิชาการ',
    other: 'อื่นๆ'
};

const ActivityList = () => {
    const [activity, setActivity] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState('');

    const fetchActivity = async () => {
        try {
            const response = await fetch('/api/activity/');
            const data = await response.json();
            setActivity(data);
        } catch (error) {
            console.error('Failed to fetch activity', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchActivity();
    }, []);

    const showModal = (file) => {
        setModalContent(file);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const statusTag = (value) => {
        switch (value) {
            case 'pass':
                return <Tag color="green">{Status.pass}</Tag>;
            case 'fail':
                return <Tag color="volcano">{Status.fail}</Tag>;
            case 'wait':
                return <Tag color="geekblue">{Status.wait}</Tag>;
            default:
                return <Tag color="default">ไม่ทราบสถานะ</Tag>;
        }
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

    const filteredActivity = activity.filter((item) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            item.activity?.name.toLowerCase().includes(searchLower) ||
            item.activity?.type.toLowerCase().includes(searchLower) ||
            item.activity?.year.toString().toLowerCase().includes(searchLower) ||
            Status[item.audit]?.toLowerCase().includes(searchLower) ||
            Status[item.approve]?.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold mb-6" style={{ color: '#2D427C' }} >ผลงานกิจกรรม</h1>
                <SearchInput
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ค้นหาบันทึกการสอน..."
                />
            </div>
            <div style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                {filteredActivity.length > 0 ? (
                    filteredActivity.map((activity, index) => (
                        <Card
                            key={activity.id}
                            title={`กิจกรรมที่ ${index + 1} - ${activity.activity?.name}`}
                            style={{ headerHeight: '38px' }}
                            className="max-w-6xl mx-auto px-4 py-6 shadow-xl small-card"
                        >
                            <Descriptions layout="horizontal" size="small" className="small-descriptions">
                                <Descriptions.Item label="ผู้ใช้">{activity.user?.username}</Descriptions.Item>
                                <Descriptions.Item label="ประเภท">{Type[activity.activity?.type]}</Descriptions.Item>
                                <Descriptions.Item label="ปี">{activity.activity?.year}</Descriptions.Item>
                                <Descriptions.Item label="ตรวจสอบ">{statusTag(activity.audit)}</Descriptions.Item>
                                <Descriptions.Item label="อนุมัติ">{statusTag(activity.approve)}</Descriptions.Item>
                                <Descriptions.Item label="ไฟล์">
                                    <Button onClick={() => showModal(activity.file)} type="link" icon={<FontAwesomeIcon icon={faFileAlt} />}>เปิดไฟล์</Button>
                                </Descriptions.Item>
                            </Descriptions>
                            <div className="text-right">
                                    <Link href={`/admin/activity/${activity.id}`}>
                                        <Button
                                            type="link"
                                            icon={<FontAwesomeIcon icon={faPen} style={{ fontSize: '16px', color: '#FFD758' }} />}
                                        />
                                    </Link>
                                </div>
                        </Card>
                    ))
                ) : (
                    <div className="text-center">ไม่มีข้อมูล</div>
                )}
                <Modal
                    title="Preview File"
                    open={isModalVisible}
                    onCancel={closeModal}
                    footer={[
                        <Button key="download" type="primary" href={modalContent} target="_blank" download>ดาวน์โหลด PDF</Button>,
                        <Button key="cancel" onClick={closeModal}>ยกเลิก</Button>
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
        </div>
    );
};

export default ActivityList;
