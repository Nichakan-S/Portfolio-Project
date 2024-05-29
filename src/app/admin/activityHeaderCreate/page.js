'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { SuccessAlert, WarningAlert } from '../../components/sweetalert';
import { Button, Input, Select, Card, Row, Col, DatePicker, Modal, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const CreateTeaching = () => {
    const { data: session } = useSession();
    const [teaching, setTeaching] = useState([]);
    const [selectedSubjects, setSelectedSubjects] = useState('');
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [year, setYear] = useState('');
    const [audit, setAudit] = useState('wait');
    const [modalVisible, setModalVisible] = useState(false);
    const [previewFile, setPreviewFile] = useState('');

    useEffect(() => {
        const fetchTeaching = async () => {
            try {
                const response = await fetch('/api/subject');
                const data = await response.json();
                setTeaching(data);
            } catch (error) {
                console.error('Failed to fetch subjects', error);
            }
        };
        fetchTeaching();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedSubjects || !name || !type || !start || !end || !year || !audit) {
            WarningAlert('ผิดพลาด!', 'กรุณากรอกข้อมูลให้ครบทุกช่อง');
            return;
        }

        try {
            const response = await fetch('/api/teaching', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    starttime: start.toISOString(),
                    endtime: end.toISOString(),
                    day: start.format('ddd').toLowerCase(),
                    group: 'A', // Assuming group is fixed or set dynamically elsewhere
                    term: 1, // Assuming term is fixed or set dynamically elsewhere
                    year: parseInt(year, 10),
                    audit,
                    subjectsId: selectedSubjects,
                    userId: session.user.id
                })
            });

            if (!response.ok) throw new Error('Something went wrong');

            SuccessAlert('สำเร็จ!', 'ข้อมูลได้ถูกบันทึกแล้ว');
        } catch (error) {
            console.error(error);
            WarningAlert('ผิดพลาด!', 'ไม่สามารถบันทึกข้อมูลได้');
        }
    };

    const customRequest = (options) => {
        const { file } = options;
        setPreviewFile(URL.createObjectURL(file));
    };

    const beforeUpload = (file) => {
        return file.type === 'application/pdf';
    };

    const handleFileInputClick = () => {
        document.getElementById('hiddenFileInput').click();
    };

    return (
        <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-3xl font-bold mb-6" style={{ color: "#2D427C" }}>เพิ่มการสอน</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="max-w-6xl mx-auto px-4 py-8 shadow-xl">
                    <Row gutter={16}>
                        <Col span={24}>
                            <div style={{ marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <label htmlFor="name" className="block text-base font-medium mr-4" style={{ width: '15%' }}>
                                        <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> ชื่อกิจกรรม : </span>
                                    </label>
                                    <Input
                                        placeholder="ชื่อกิจกรรม"
                                        size="large"
                                        name="name"
                                        id="name"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="flex-grow"
                                        style={{
                                            width: '85%',
                                            borderColor: '#DADEE9',
                                            fontSize: '16px',
                                            height: '40px'
                                        }}
                                    />
                                </div>
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <label htmlFor="type" className="block text-base font-medium mr-4" style={{ width: '15%' }}>
                                        <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> ประเภท : </span>
                                    </label>
                                    <Select
                                        id="type"
                                        value={type}
                                        onChange={(value) => setType(value)}
                                        required
                                        style={{
                                            width: '85%',
                                            borderColor: '#DADEE9',
                                            fontSize: '16px',
                                            height: '40px'
                                        }}
                                    >
                                        <Select.Option value="">เลือกประเภท</Select.Option>
                                        <Select.Option value="culture">ศิลปะวัฒนธรรม</Select.Option>
                                        <Select.Option value="service">บริการวิชาการ</Select.Option>
                                        <Select.Option value="other">อื่น ๆ</Select.Option>
                                    </Select>
                                </div>
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <label htmlFor="start" className="block text-base font-medium mr-4" style={{ width: '15%' }}>
                                        <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> เวลาเริ่ม : </span>
                                    </label>
                                    <DatePicker
                                        value={start}
                                        onChange={(date) => setStart(date)}
                                        showTime
                                        format="DD-MM-YYYY HH:mm"
                                        required
                                        style={{
                                            width: '85%',
                                            borderColor: '#DADEE9',
                                            fontSize: '16px',
                                            height: '40px'
                                        }}
                                    />
                                </div>
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <label htmlFor="end" className="block text-base font-medium mr-4" style={{ width: '15%' }}>
                                        <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> สิ้นสุดเวลา : </span>
                                    </label>
                                    <DatePicker
                                        value={end}
                                        onChange={(date) => setEnd(date)}
                                        showTime
                                        format="DD-MM-YYYY HH:mm"
                                        required
                                        style={{
                                            width: '85%',
                                            borderColor: '#DADEE9',
                                            fontSize: '16px',
                                            height: '40px'
                                        }}
                                    />
                                </div>
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <label htmlFor="year" className="block text-base font-medium mr-4" style={{ width: '15%' }}>
                                        <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> ปี : </span>
                                    </label>
                                    <Input
                                        placeholder="ปี"
                                        size="large"
                                        type="number"
                                        name="year"
                                        id="year"
                                        required
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        style={{
                                            width: '85%',
                                            borderColor: '#DADEE9',
                                            fontSize: '16px',
                                            height: '40px'
                                        }}
                                    />
                                </div>
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <label htmlFor="file" className="block text-base font-medium mr-4" style={{ width: '15%' }}>
                                        <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> ไฟล์ PDF : </span>
                                    </label>
                                    <div style={{ width: '85%', display: 'flex', alignItems: 'center' }}>
                                        <Button
                                            type="primary"
                                            icon={<UploadOutlined />}
                                            onClick={handleFileInputClick}
                                            style={{ backgroundColor: "white", color: "black", borderColor: "gray" }}
                                            className="shadow-xl"
                                        >
                                            Upload PDF
                                        </Button>
                                        <input
                                            type="file"
                                            id="hiddenFileInput"
                                            style={{ display: 'none' }}
                                            accept=".pdf"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (beforeUpload(file)) {
                                                    customRequest({ file });
                                                }
                                            }}
                                        />
                                        <Button onClick={() => setModalVisible(true)} style={{ marginLeft: 10 }}>
                                            ดูตัวอย่างไฟล์ PDF
                                        </Button>
                                        <Modal
                                            title="ตัวอย่างไฟล์ PDF"
                                            open={modalVisible}
                                            onCancel={() => setModalVisible(false)}
                                            footer={[]}
                                            width="70%"
                                            style={{ top: 20 }}
                                        >
                                            {previewFile && (
                                                <embed src={previewFile} type="application/pdf" style={{ width: '100%', height: '75vh' }} />
                                            )}
                                        </Modal>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '15px' }}>
                        <Button
                            type="primary"
                            size="middle"
                            onClick={handleSubmit}
                            style={{
                                backgroundColor: '#02964F',
                                borderColor: '#02964F'
                            }}
                        >
                            บันทึก
                        </Button>
                    </div>
                </Card>
            </form>
        </div>
    );
};

export default CreateTeaching;
