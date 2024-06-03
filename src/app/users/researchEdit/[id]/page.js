'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Descriptions, Card, Input, Button, Select, Tag, Modal } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SearchInput from '/src/app/components/SearchInputAll.jsx';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

const { Option } = Select;

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
            setResearch(data);
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

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="mt-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            </div>
        );
    }

    const filteredResearch = research.filter((item) => {
        return item.nameTH.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.researchFund.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ResearchType[item.type].toLowerCase().includes(searchTerm.toLowerCase()) ||
            Status[item.status].toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.year.toString().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="max-w-6xl mx-auto px-4 mt-2">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold mb-6" style={{ color: '#2D427C' }}>แก้ไขผลงานวิจัย</h1>
                <SearchInput
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ค้นหางานวิจัย..."
                />
            </div >
            <div style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                {filteredResearch.length > 0 ? (
                    filteredResearch.map((item, index) => (
                        <Card 
                            key={item.id} 
                            className="max-w-6xl mx-auto px-4 py-6 shadow-xl small-card"
                            style={{ headerHeight: '38px' }}
                            title={`งานวิจัย: ${item.nameTH}`}
                            >
                            <Descriptions layout="horizontal" size="small" className="small-descriptions">
                                <Descriptions.Item label="ทุน">{item.researchFund}</Descriptions.Item>
                                <Descriptions.Item label="ประเภท">{ResearchType[item.type]}</Descriptions.Item>
                                <Descriptions.Item label="ปีที่ตีพิมพ์">{item.year}</Descriptions.Item>
                                <Descriptions.Item label="ตรวจสอบ"><Tag color={StatusColors[item.audit]}>{Status[item.audit]}</Tag></Descriptions.Item>
                                <Descriptions.Item label="อนุมัติ"><Tag color={StatusColors[item.approve]}>{Status[item.approve]}</Tag></Descriptions.Item>
                                <Descriptions.Item label="ไฟล์">
                                    <Button 
                                        type="link"
                                        onClick={() => showModal(item.file)}
                                        style={{ color: '#FFD758' }}
                                        className ="mr-4 mb-4"
                                        >เปิดไฟล์
                                        
                                    </Button>
                                </Descriptions.Item>
                            </Descriptions>
                            <div className="text-right ">
                                <Link href={`/users/researchEdit/edit/${item.id}`}>
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
                title="Preview File"
                visible={isModalVisible}
                onCancel={closeModal}
                footer={null}
            >
                {modalContent ? (
                    <iframe src={`${modalContent}`} style={{ width: '100%', height: '75vh' }}></iframe>
                ) : (
                    <p>Error displaying the document. Please try again.</p>
                )}
            </Modal>
        </div>
    );
};

export default ResearchList;
