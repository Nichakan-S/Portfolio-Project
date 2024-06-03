'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { SuccessAlert, WarningAlert } from '../../components/sweetalert';
import { Input, Button, Upload, Modal, Select, Card, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const CreateResearch = () => {
    const { data: session } = useSession();
    const [nameTH, setNameTH] = useState('');
    const [nameEN, setNameEN] = useState('');
    const [researchFund, setResearchFund] = useState('');
    const [type, setType] = useState('');
    const [file, setFile] = useState('');
    const [year, setYear] = useState('');
    const [previewFile, setPreviewFile] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [customFund, setCustomFund] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fund = researchFund === 'other' ? customFund : researchFund;
        console.log(JSON.stringify({
            userId: session.user.id,
            nameTH,
            nameEN,
            researchFund: fund,
            type,
            year: parseInt(year, 10),
            audit: 'wait',
            approve: 'wait'
        }));

        try {
            const response = await fetch('/api/research', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: session.user.id,
                    nameTH,
                    nameEN,
                    researchFund: fund,
                    type,
                    file,
                    year: parseInt(year, 10),
                    audit: 'wait',
                    approve: 'wait'
                })
            });

            if (!response.ok) throw new Error('Something went wrong');
            SuccessAlert('สำเร็จ!', 'ข้อมูลได้ถูกบันทึกแล้ว');
            setNameTH('');
            setNameEN('');
            setResearchFund('');
            setType('');
            setFile('');
            setYear('');
            setPreviewFile(null);
            setCustomFund('');
        } catch (error) {
            console.error(error);
            WarningAlert('ผิดพลาด!', 'ไม่สามารถบันทึกข้อมูลได้');
        }
    };

    const handleResearchFundChange = (value) => {
        if (value === 'other') {
            setCustomFund('');
            setResearchFund(value);
        } else {
            setResearchFund(value);
            setCustomFund('');
        }
    };

    const handleCustomFundChange = (e) => {
        const value = e.target.value;
        setCustomFund(value);
    };

    const beforeUpload = (file) => {
        const isPDF = file.type === 'application/pdf';
        const isLt30M = file.size / 1024 / 1024 < 30;
        if (!isPDF) {
            WarningAlert('ผิดพลาด!', 'กรุณาอัปโหลดไฟล์ PDF เท่านั้น!');
        }
        if (!isLt30M) {
            WarningAlert('ผิดพลาด!', 'ไฟล์ต้องมีขนาดไม่เกิน 30 MB!');
        }
        return isPDF && isLt30M;
    };

    const customRequest = ({ file }) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setFile(reader.result);
            setPreviewFile(reader.result);
        };
    };

    return (
        <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-3xl font-bold mb-6" style={{ color: "#2D427C" }}>เพิ่มงานวิจัยใหม่</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="max-w-6xl mx-auto px-4 py-8 shadow-xl" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                    <Row gutter={16}>
                        <Col span={24}>
                            <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                                <label htmlFor="nameTH" className="block text-base font-medium mr-4 mb-4">
                                    <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> ชื่องานวิจัย ไทย : </span>
                                </label>
                                <Input
                                    placeholder="ชื่องานวิจัย (ไทย)"
                                    size="large"
                                    type="text"
                                    name="nameTH"
                                    id="nameTH"
                                    required
                                    value={nameTH}
                                    onChange={(e) => setNameTH(e.target.value)}
                                    style={{
                                        width: '50%',
                                        borderColor: '#DADEE9',
                                        fontSize: '16px',
                                        height: '40px'
                                    }}
                                    className="flex-grow mr-4 mb-4"
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                                <label htmlFor="nameEN" className="block text-base font-medium mr-4 mb-4">
                                    <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> ชื่องานวิจัย อังกฤษ : </span>
                                </label>
                                <Input
                                    placeholder="ชื่องานวิจัย (อังกฤษ)"
                                    size="large"
                                    type="text"
                                    name="nameEN"
                                    id="nameEN"
                                    required
                                    value={nameEN}
                                    onChange={(e) => setNameEN(e.target.value)}
                                    style={{
                                        width: '50%',
                                        borderColor: '#DADEE9',
                                        fontSize: '16px',
                                        height: '40px'
                                    }}
                                    className="flex-grow mr-4 mb-4"
                                />
                            </div
                        ></Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                                <label htmlFor="researchFund" className="block text-base font-medium mr-4 mb-4" >
                                    <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> ทุน : </span>
                                </label>
                                    <Select
                                        value={researchFund !== 'other' ? researchFund : ''}
                                        size="large"
                                        onChange={handleResearchFundChange}
                                        required
                                        className="mr-4 mb-4 flex-grow custom-select"
                                        style={{
                                            width: '40%',
                                            borderColor: '#DADEE9',
                                            fontSize: '16px',
                                            height: '40px'
                                        }}
                                    >
                                        <Option value="">เลือกประเภท</Option>
                                        <Option value="ทุนภายใน">ทุนภายใน</Option>
                                        <Option value="ทุนภายนอก">ทุนภายนอก</Option>
                                        <Option value="other">อื่นๆ (โปรดระบุ)</Option>
                                    </Select>
                                    {researchFund === 'other' && (
                                        <Input
                                            type="text"
                                            value={customFund}
                                            onChange={handleCustomFundChange}
                                            placeholder="ระบุทุน"
                                            required
                                            className="flex-grow mr-4 mb-4"
                                            style={{
                                                width: '30%',
                                                borderColor: '#DADEE9',
                                                fontSize: '16px',
                                                height: '40px'
                                            }}
                                        />
                                    )}
                                
                            </div>
                        </Col>
                        <Col span={12}>
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                            <label htmlFor="type" className="block text-base font-medium mr-4 mb-4">
                                <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> ประเภท : </span>
                            </label>
                            <Select
                                value={type}
                                onChange={(value) => setType(value)}
                                required
                                className="flex-grow mr-4 mb-4"
                                style={{
                                    width: '50%',
                                    borderColor: '#DADEE9',
                                    fontSize: '16px',
                                    height: '40px'
                                }}
                            >
                                <Option value="">เลือกประเภท</Option>
                                <Option value="journalism">สื่อสารมวลชน</Option>
                                <Option value="researchreports">รายงานการวิจัย</Option>
                                <Option value="posterpresent">โปสเตอร์ปัจจุบัน</Option>
                            </Select>
                        </div>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                             <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                                <label htmlFor="file" className="block text-base font-medium mr-4 mb-4">
                                    <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> ไฟล์ PDF : </span>
                                </label>
                                <Upload
                                    customRequest={customRequest}
                                    beforeUpload={beforeUpload}
                                    showUploadList={false}
                                    
                                >
                                    <Button icon={<UploadOutlined />}className="mr-4 mb-4">เลือกไฟล์</Button>
                                </Upload>
                                <Button onClick={() => setModalVisible(true)} className="mr-4 mb-4">ดูตัวอย่างไฟล์ PDF</Button>
                            </div>
                            <Modal
                                title="ตัวอย่างไฟล์ PDF"
                                visible={modalVisible}
                                onCancel={() => setModalVisible(false)}
                                footer={null}
                                width="70%"
                                style={{ top: 20 }}
                            >
                                {previewFile && (
                                    <embed src={previewFile} type="application/pdf" style={{ width: '100%', height: '75vh' }} />
                                )}
                            </Modal>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24}>
                            <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                                <label htmlFor="year" className="block text-base font-medium mr-4 mb-4">
                                    <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> ปี พ.ศ. : </span>
                                </label>
                                <Input
                                    placeholder="เลือกปี"
                                    size="large"
                                    type="number"
                                    name="year"
                                    id="year"
                                    required
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    className='mr-4 mb-4'
                                    style={{
                                        width: '50%',
                                        borderColor: '#DADEE9',
                                        fontSize: '16px',
                                        height: '40px'
                                    }}
                                />
                            </div>
                        </Col>
                    </Row>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', width: '102%', padding: '15px' }}>
                        <Button
                            className="inline-flex justify-center text-right mr-4"
                            type="primary"
                            size="middle"
                            htmlType="submit"
                            style={{ backgroundColor: '#00B96B', borderColor: '#00B96B' }}
                        >
                            บันทึก
                        </Button>
                    </div>
                </Card>
            </form>
        </div>
    );
};

export default CreateResearch;
