'use client';

import React, { useEffect, useState } from 'react';
import { Button, Card, Input, Modal, Descriptions, Tag, Select } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { SuccessAlert, WarningAlert, ConfirmAlert } from '/src/app/components/sweetalert';
import '/src/app/globals.css';
import SearchInput from '/src/app/components/SearchInputAll.jsx';

const { Option } = Select;

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
    const { id } = params;
    const [activity, setActivity] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [year, setYear] = useState('all');  // ย้าย useState มาอยู่ตรงนี้

    const fetchActivity = async () => {
        try {
            const response = await fetch(`/api/userActivity/${id}`);
            const data = await response.json();
            setActivity(data);
        } catch (error) {
            console.error('Failed to fetch activity', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchActivity();
        }
    }, [id]);

    const handleDelete = async (id) => {
        ConfirmAlert('คุณแน่ใจที่จะลบข้อมูลนี้?', 'การดำเนินการนี้ไม่สามารถย้อนกลับได้', async () => {
            try {
                const response = await fetch(`/api/activity/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error('Failed to delete the activity.');
                SuccessAlert('ลบสำเร็จ!', 'ข้อมูลถูกลบแล้ว');
                setActivity(activity.filter(item => item.id !== id));
            } catch (error) {
                console.error('Failed to delete the activity', error);
                WarningAlert('ผิดพลาด!', 'ไม่สามารถลบข้อมูลได้');
            }
        });
    };

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

    const filteredActivity = activity.filter(activity => {
        const matchesYear = year === 'all' || activity.activity?.year.toString() === year;
        const searchTermLower = searchTerm.toLowerCase();

        return matchesYear && (
            activity.activity?.name.toLowerCase().includes(searchTermLower) ||
            activity.activity?.type.toLowerCase().includes(searchTermLower) ||
            Status[activity.audit].toLowerCase().includes(searchTermLower) ||
            Status[activity.approve].toLowerCase().includes(searchTermLower)
        );
    });

    return (
        <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold mb-6" style={{ color: '#2D427C' }}>ลบผลงานกิจกรรม</h1>
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
                            style={{ marginBottom: 20 }}
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
                            <div className="text-right">
                                <Button
                                    type="link"
                                    onClick={() => handleDelete(activity.id)}
                                    icon={<FontAwesomeIcon icon={faTrash} style={{ fontSize: '16px', color: 'red' }} />}
                                />
                            </div>
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
                    <iframe src={modalContent} loading="lazy" style={{ width: '100%', height: '75vh' }}></iframe>
                ) : (
                    <p>Error displaying the document. Please try again.</p>
                )}
            </Modal>

        </div>
    );
};

export default ActivityList;
