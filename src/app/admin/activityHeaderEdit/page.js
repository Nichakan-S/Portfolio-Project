'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Descriptions, Card, Input, Button, Modal } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faPen } from '@fortawesome/free-solid-svg-icons';
import '/src/app/globals.css';
import moment from 'moment';
import SearchInput from '/src/app/components/SearchInput';

const ActivityList = () => {
    const [activities, setActivities] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState('');

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const res = await fetch('/api/activityHeader');
                const data = await res.json();
                setActivities(data);
            } catch (error) {
                console.error('Failed to fetch activities', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchActivities();
    }, []);

    const showModal = (file) => {
        setModalContent(file);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
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

    const filteredActivities = activities.filter(activity => {
        return activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            activity.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            activity.start.toLowerCase().includes(searchTerm.toLowerCase()) ||
            activity.year.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold" style={{ color: '#2D427C' }}>กิจกรรม</h1>
                <SearchInput
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหากิจกรรม..."
                />
            </div>
            <div style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                {filteredActivities.length > 0 ? (
                    filteredActivities.map((activity, index) => (
                        <Card
                            key={activity.id}
                            className="max-w-6xl mx-auto px-4 py-6 shadow-xl small-card"
                            title={`${activity.name}`}
                        >
                            <Descriptions layout="horizontal" size="small" className="small-descriptions">
                                <Descriptions.Item label="ประเภท">{activity.type === 'culture' ? 'ศิลปะวัฒนธรรม' : 'บริการวิชาการ'}</Descriptions.Item>
                                <Descriptions.Item label="เวลาเริ่ม">{moment(activity.start).format('DD-MM-YYYY HH:mm')}</Descriptions.Item>
                                <Descriptions.Item label="เวลาจบ">{moment(activity.end).format('DD-MM-YYYY HH:mm')}</Descriptions.Item>
                                <Descriptions.Item label="ปี">{activity.year}</Descriptions.Item>
                                <Descriptions.Item label="ไฟล์">
                                    <Button
                                        onClick={() => showModal(activity.file)}
                                        type="link"
                                        style={{ border: 'none', padding: 0, color: '#FFD758' }}
                                    >
                                        เปิดไฟล์
                                        <FontAwesomeIcon icon={faFilePdf} style={{ fontSize: '16px', marginLeft: '8px' }} />
                                    </Button>
                                </Descriptions.Item>
                            </Descriptions>
                            <div className="text-right">
                                <Link href={`/admin/activityHeaderEdit/${activity.id}`}>
                                    <Button
                                        type="link"
                                        icon={<FontAwesomeIcon icon={faPen} style={{ fontSize: '16px', color: '#FFD758' }} />}
                                    />
                                </Link>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="text-center text-sm font-medium">ไม่มีข้อมูล</div>
                )}
            </div>
            <Modal
                title="ตัวอย่างไฟล์ PDF"
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
                style={{ top: 20 }}
                width="70%"
            >
                {modalContent ? (
                    <iframe src={modalContent} loading="lazy" style={{ width: '100%', height: '75vh' }}></iframe>
                ) : (
                    <p>Error displaying the document. Please try again.</p>
                )}
            </Modal>
        </div>
    );
};

export default ActivityList;
