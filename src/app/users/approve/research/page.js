'use client'

import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, Select, Descriptions, Card, Tag } from 'antd';
import { SuccessAlert, WarningAlert, EvaluationAlert } from '../../../components/sweetalert';
import SearchInput from '/src/app/components/SearchInputAll.jsx';

const ResearchType = {
    journalism: 'ผ่านสื่อ',
    researchreports: 'เล่มตีพิมพ์',
    posterpresent: 'โปสเตอร์'
};
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

const ResearchList = () => {
    const [research, setResearch] = useState([]);
    const [selectTerm, setSelectTerm] = useState('all');
    const [inputTerm, setInputTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState('');

    useEffect(() => {
        fetchresearch();
    }, []);

    const fetchresearch = async () => {
        try {
            const res = await fetch('/api/approveResearch/');
            if (!res.ok) {
                const errorDetails = await res.json();
                throw new Error(errorDetails.details || 'Unknown error occurred');
            }
            const data = await res.json();
            console.log('research data fetched:', data);
            setResearch(data);
        } catch (error) {
            console.error('Failed to fetch research:', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (approve, id) => {
        EvaluationAlert('ยืนยันการประเมิน', 'คุณแน่ใจหรือไม่ที่จะทำการประเมินผลงานนี้?')
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const response = await fetch(`/api/approveResearch/${id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ approve })
                        });
                        if (!response.ok) throw new Error('Something went wrong');
                        SuccessAlert('สำเร็จ!', 'ข้อมูลได้ถูกประเมินแล้ว');
                        fetchresearch();
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
        console.log(file, id);
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

    const filteredResearch = Array.isArray(research) ? research.filter((research) => {
        return (
            (selectTerm === 'all' || approve[research.approve] === selectTerm) &&
            (
                research.nameTH.toLowerCase().includes(inputTerm.toLowerCase()) ||
                research.researchFund.toLowerCase().includes(inputTerm.toLowerCase()) ||
                research.type.toLowerCase().includes(inputTerm.toLowerCase()) ||
                research.year.toString().toLowerCase().includes(inputTerm.toLowerCase())
            )
        );
    }) : [];

    return (
        <div className="max-w-6xl mx-auto px-4 mt-2">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold mb-6" style={{ color: '#2D427C' }}>อนุมัติผลงานวิจัย</h1>
                <div className="flex items-center">
                    <SearchInput
                        value={inputTerm}
                        onChange={(e) => setInputTerm(e.target.value)}
                        placeholder="ค้นหาวิจัย..."
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
                {filteredResearch.length > 0 ? (
                    filteredResearch.map((research, index) => (
                        <Card
                            key={research.id}
                            className="max-w-6xl mx-auto px-4 py-6 shadow-xl small-card"
                            style={{ headerHeight: '38px' }}
                            title={`งานวิจัย: ${research.nameTH}`}
                        >
                            <Descriptions layout="horizontal" size="small" className="small-descriptions">
                                <Descriptions.Item label="ทุน">{research.researchFund}</Descriptions.Item>
                                <Descriptions.Item label="ประเภท">{ResearchType[research.type]}</Descriptions.Item>
                                <Descriptions.Item label="ปีที่ตีพิมพ์">{research.year}</Descriptions.Item>
                                <Descriptions.Item label="ตรวจสอบ"><Tag color={StatusColors[research.audit]}>{approve[research.audit]}</Tag></Descriptions.Item>
                                <Descriptions.Item label="อนุมัติ"><Tag color={StatusColors[research.approve]}>{approve[research.approve]}</Tag></Descriptions.Item>
                                <Descriptions.Item label="เจ้าของผลงาน">{research.user?.username} </Descriptions.Item>
                                <Descriptions.Item label="ไฟล์">
                                    <Button
                                        type="link"
                                        onClick={() => showModal(research.file, research.id)}
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
                                    onClick={() => handleSubmit('pass', research.id)}
                                >
                                    ผ่าน
                                </Button>
                                <Button
                                    type="primary"
                                    danger
                                    className="mr-2"
                                    style={{ backgroundColor: '#E50000', borderColor: '#E50000' }}
                                    onClick={() => handleSubmit('fail', research.id)}
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
                            <Button
                                type="primary"
                                className="mr-2"
                                style={{ backgroundColor: '#02964F', borderColor: '#02964F' }}
                                onClick={() => handleSubmit('pass', modalContent.id)}
                            >
                                ผ่าน
                            </Button>
                            <Button
                                type="primary"
                                danger
                                className="mr-2"
                                style={{ backgroundColor: '#E50000', borderColor: '#E50000' }}
                                onClick={() => handleSubmit('fail', modalContent.id)}
                            >
                                ไม่ผ่าน
                            </Button>
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

export default ResearchList;
