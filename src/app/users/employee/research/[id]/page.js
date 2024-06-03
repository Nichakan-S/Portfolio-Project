'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Descriptions, Card, Input, Button, Modal, Tag } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import '/src/app/globals.css'
import SearchInput from '/src/app/components/SearchInput';

const ResearchType = {
    journalism: 'ผ่านสื่อ',
    researchreports: 'เล่มตีพิมพ์',
    posterpresent: 'โปสเตอร์'
};
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

const ResearchList = ({ params }) => {
    const [username, setUsername] = useState('');
    const [research, setResearch] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const { id } = params;

    const fetchResearch = async (id) => {
        try {
            const response = await fetch(`/api/userResearch/${id}`);
            const data = await response.json();
            console.log('research data fetched:', data);
            setResearch(data);
            setUsername(data[0]?.user?.username);
        } catch (error) {
            console.error('Failed to fetch research', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchResearch(parseInt(id));
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

    const filteredResearch = research.filter((research) => {
        return research.nameTH.toLowerCase().includes(searchTerm.toLowerCase()) ||
            research.researchfund.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ResearchType[research.type].includes(searchTerm.toLowerCase()) ||
            Status[research.audit].includes(searchTerm.toLowerCase()) ||
            Status[research.approve].includes(searchTerm.toLowerCase()) ||
            research.year.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold mb-6" style={{ color: '#2D427C' }}>ผลงานวิจัยของ {username}</h1>
                <SearchInput
                    value={searchTerm}
                    onChange={(value) => setSearchTerm(value)}
                    placeholder="ค้นหาผลงานวิจัย..."
                />
            </div>
            <div style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                {filteredResearch.length > 0 ? (
                    filteredResearch.map((research, index) => (
                        <Card
                            key={research.id}
                            className="max-w-6xl mx-auto px-4 py-6 shadow-xl small-card"
                            style={{ headerHeight: '38px' }}
                            title={`งานวิจัย: ${research.nameTH}`}
                        >
                            <Descriptions layout="horizontal" size="small" className="small-descriptions">
                                <Descriptions.Item label="ทุน">{research.researchfund}</Descriptions.Item>
                                <Descriptions.Item label="ประเภท">{ResearchType[research.type]}</Descriptions.Item>
                                <Descriptions.Item label="ปีที่ตีพิมพ์">{research.year}</Descriptions.Item>
                                <Descriptions.Item label="ตรวจสอบ"><Tag color={StatusColors[research.audit]}>{Status[research.audit]}</Tag></Descriptions.Item>
                                <Descriptions.Item label="อนุมัติ"><Tag color={StatusColors[research.approve]}>{Status[research.approve]}</Tag></Descriptions.Item>
                                <Descriptions.Item label="ไฟล์">
                                    <Button
                                        type="link"
                                        onClick={() => showModal(research.file)}
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

export default ResearchList;
