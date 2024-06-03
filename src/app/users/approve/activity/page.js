'use client'

import React, { useEffect, useState } from 'react';
import { Button, Modal, Select, Descriptions, Card, Tag } from 'antd';
import { SuccessAlert, WarningAlert, EvaluationAlert } from '../../../components/sweetalert';
import SearchInput from '/src/app/components/SearchInputAll.jsx';

const approve = {
    wait: 'รอตรวจ',
    pass: 'ผ่าน',
    fail: 'ไม่ผ่าน'
};

const StatusColors = {
    wait: 'geekblue',
    pass: 'green',
    fail: 'red'
};

const ActivityList = () => {
    const [activity, setActivity] = useState([]);
    const [selectTerm, setSelectTerm] = useState('all');
    const [inputTerm, setInputTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState('');

    useEffect(() => {
        fetchactivity();
    }, []);

    const fetchactivity = async () => {
        try {
            const res = await fetch('/api/approveActivity/');
            if (!res.ok) {
                const errorDetails = await res.json();
                throw new Error(errorDetails.details || 'Unknown error occurred');
            }
            const data = await res.json();
            console.log('activity data fetched:', data);
            setActivity(data);
        } catch (error) {
            console.error('Failed to fetch activity:', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (approve, id) => {
        EvaluationAlert('ยืนยันการประเมิน', 'คุณแน่ใจหรือไม่ที่จะทำการประเมินผลงานนี้?')
            .then(async (result) => {
                if (result.isConfirmed) {
                    console.log(approve, id);
                    try {
                        const response = await fetch(`/api/approveActivity/${id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ approve })
                        });
                        if (!response.ok) throw new Error('Something went wrong');
                        SuccessAlert('สำเร็จ!', 'ข้อมูลได้ถูกประเมินแล้ว');
                        fetchactivity();
                    } catch (error) {
                        console.error(error);
                        WarningAlert('ผิดพลาด!', 'ไม่สามารถประเมินข้อมูลได้');
                    }
                }
            }).catch((error) => {
                console.error('Promise error:', error);
            });
    };

    const showModal = (file, id) => {
        setModalContent({ file, id });
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

    const filteredActivity = Array.isArray(activity) ? activity.filter((activity) => {
        return (
            (selectTerm === 'all' || approve[activity.approve] === selectTerm) &&
            (
                activity.activity?.name.toLowerCase().includes(inputTerm.toLowerCase()) ||
                activity.activity?.type.toLowerCase().includes(inputTerm.toLowerCase()) ||
                activity.activity?.year.toString().toLowerCase().includes(inputTerm.toLowerCase())
            )
        );
    }) : [];

    return (
        <div className="max-w-6xl mx-auto px-4 mt-2">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold mb-6" style={{ color: '#2D427C' }}>อนุมัติผลงานกิจกรรม</h1>
                <div className="flex items-center">
                    <SearchInput
                        value={inputTerm}
                        onChange={(e) => setInputTerm(e.target.value)}
                        placeholder="ค้นหากิจกรรม..."
                    />
                    <Select
                        value={selectTerm}
                        onChange={(value) => setSelectTerm(value)}
                        className="flex-grow"
                        style={{
                            flexBasis: '0%',
                            flexGrow: 1,
                            width: '100%',
                            borderColor: '#DADEE9',
                            minWidth: '100px'
                        }}
                        options={[
                            { value: 'all', label: 'ทั้งหมด' },
                            { value: 'รอ', label: 'รอ' },
                            { value: 'ผ่าน', label: 'ผ่าน' },
                            { value: 'ไม่ผ่าน', label: 'ไม่ผ่าน' }
                        ]}
                    />
                </div>
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
                                <Descriptions.Item label="ตรวจสอบ"><Tag color={StatusColors[activity.audit]}>{approve[activity.audit]}</Tag></Descriptions.Item>
                                <Descriptions.Item label="อนุมัติ"><Tag color={StatusColors[activity.approve]}>{approve[activity.approve]}</Tag></Descriptions.Item>
                                <Descriptions.Item label="เจ้าของผลงาน">{activity.user?.username}</Descriptions.Item>
                                <Descriptions.Item label="ไฟล์">
                                    <Button
                                        type="link"
                                        onClick={() => showModal(activity.file, activity.id)}
                                        style={{ color: '#FFD758' }}
                                    >
                                        เปิดไฟล์
                                    </Button>
                                </Descriptions.Item>
                            </Descriptions>
                            <div className="text-right">
                                <Button
                                    type="primary"
                                    className="mr-2"
                                    style={{ backgroundColor: '#02964F', borderColor: '#02964F' }}
                                    onClick={() => handleSubmit('pass', activity.id)}
                                >
                                    ผ่าน
                                </Button>
                                <Button
                                    type="primary"
                                    danger
                                    className="mr-2"
                                    style={{ backgroundColor: '#E50000', borderColor: '#E50000' }}
                                    onClick={() => handleSubmit('fail', activity.id)}
                                >
                                    ไม่ผ่าน
                                </Button>
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
                    <div key="footer" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <Button key="download" type="primary" href={modalContent.file} target="_blank" download>
                            ดาวน์โหลด PDF
                        </Button>
                        <div>
                            <Button key="cancel" onClick={closeModal}>
                                ยกเลิก
                            </Button>
                        </div>
                    </div>
                ]}
                width="70%"
                style={{ top: 20 }}
            >
                {modalContent ? (
                    <iframe src={modalContent.file} loading="lazy" style={{ width: '100%', height: '75vh' }}></iframe>
                ) : (
                    <p>Error displaying the document. Please try again.</p>
                )}
            </Modal>
        </div>
    );
};

export default ActivityList;
