'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SuccessAlert, WarningAlert } from '../../../components/sweetalert';
import { Input, Button, Upload, Modal, Select, Col, Card, Row } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';

const { Option } = Select;

const EditActivity = ({ params }) => {
    const { id } = params;
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [file, setFile] = useState('');
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [year, setYear] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchActivity(parseInt(id));
        }
    }, [id]);

    const fetchActivity = async (id) => {
        try {
            const response = await fetch(`/api/activityHeader/${id}`);
            const data = await response.json();
            if (!response.ok) throw new Error('Failed to fetch Activity');
            setName(data.name);
            setType(data.type);
            setFile(data.file);
            setStart(new Date(data.start));
            setEnd(new Date(data.end));
            setYear(data.year);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!start || !end) {
            WarningAlert('ผิดพลาด!', 'กรุณาเลือกเวลาเริ่มและเวลาสิ้นสุด!');
            return;
        }

        if (moment(end).isBefore(moment(start))) {
            WarningAlert('ผิดพลาด!', 'เวลาเริ่มต้องไม่เกินเวลาสิ้นสุด!');
            return;
        }

        try {
            const response = await fetch(`/api/activityHeader/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    type,
                    file,
                    start: moment(start).toISOString(),
                    end: moment(end).toISOString(),
                    year: parseInt(year, 10)
                })
            });

            if (!response.ok) throw new Error('Something went wrong');

            SuccessAlert('สำเร็จ!', 'ข้อมูลได้ถูกบันทึกแล้ว');
            router.push('/admin/activityHeaderEdit');
        } catch (error) {
            console.error(error);
            WarningAlert('ผิดพลาด!', 'ไม่สามารถบันทึกข้อมูลได้');
        }
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
            setModalContent(reader.result); // Ensure modal content is also set
        };
    };

    const showModal = () => {
        setModalContent(file);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const handleBack = () => {
        router.push('/admin/activityHeaderEdit');
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

    return (
        <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-2xl font-semibold mb-6">เพิ่มกิจกรรม</h1>
            <div style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                <form onSubmit={handleSubmit} className="space-y-6" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                    <Card className="max-w-6xl mx-auto px-4 py-8 shadow-xl">
                        <Row gutter={16}>
                            <Col span={12}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                                        <label htmlFor="name" className="block text-base font-medium mr-4 mb-4">
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
                                            className="flex-grow mr-4 mb-4"
                                            style={{
                                                flexGrow: 1,
                                                flexShrink: 1,
                                                flexBasis: '50%',
                                                padding: '8px',
                                                minWidth: '300px'
                                            }}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                                        <label htmlFor="type" className="block text-base font-medium mr-4 mb-4">
                                            <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> ประเภท : </span>
                                        </label>
                                        <Select
                                            value={type}
                                            size="large"
                                            onChange={(value) => setType(value)}
                                            required
                                            className="flex-grow mr-4 mb-4 custom-select"
                                            style={{
                                                width: '50%',
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
                                <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                        <label htmlFor="start" className="block text-base font-medium mr-4 mb-4">
                                            <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> เวลาเริ่ม : </span>
                                        </label>
                                        <DatePicker
                                            selected={start}
                                            onChange={(date) => setStart(date)}
                                            showTimeSelect
                                            dateFormat="dd-MM-yyyy HH:mm"
                                            timeFormat="HH:mm"
                                            timeIntervals={15}
                                            required
                                            calendarClassName="border rounded-lg shadow-md"
                                            className="w-full border rounded-lg py-2 px-4 flex-grow mr-4 mb-4"
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                        <label htmlFor="end" className="block text-base font-medium mr-4 mb-4">
                                            <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> สิ้นสุดเวลา : </span>
                                        </label>
                                        <DatePicker
                                            selected={end}
                                            onChange={(date) => setEnd(date)}
                                            showTimeSelect
                                            dateFormat="dd-MM-yyyy HH:mm"
                                            timeFormat="HH:mm"
                                            timeIntervals={15}
                                            required
                                            calendarClassName="border rounded-lg shadow-md"
                                            className="w-full border rounded-lg py-2 px-4 flex-grow mr-4 mb-4"
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', width: '50%' }}>
                                        <label htmlFor="year" className="block text-base font-medium mr-4">
                                            <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> ปี : </span>
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
                                            style={{ width: 200 }}
                                        />
                                    </div>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                        <label htmlFor="file" className="block text-base font-medium mr-4 mb-4">
                                            <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> ไฟล์ PDF : </span>
                                        </label>
                                        <Upload
                                            customRequest={customRequest}
                                            beforeUpload={beforeUpload}
                                            showUploadList={false}
                                        >
                                            <Button
                                                icon={<UploadOutlined />}
                                                onClick={showModal}
                                                className="mr-4 mb-4">เลือกไฟล์</Button>
                                        </Upload>
                                        <Button onClick={showModal} className="mr-4 mb-4">ดูตัวอย่างไฟล์ PDF</Button>
                                        <Modal
                                            title="ตัวอย่างไฟล์ PDF"
                                            open={isModalVisible}
                                            onCancel={closeModal}
                                            footer={[]}
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
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '102%', padding: '15px' }}>
                                    <Button className="inline-flex justify-center mr-4 "
                                        type="primary"
                                        size="middle"
                                        onClick={handleSubmit}
                                        style={{ backgroundColor: '#00B96B', borderColor: '#00B96B' }}
                                    >
                                        บันทึก
                                    </Button>
                                    <Button
                                        className="inline-flex justify-center mr-4"
                                        onClick={handleBack}
                                        size="middle"
                                    >
                                        ยกเลิก
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </form>
            </div>
        </div>
    );
};

export default EditActivity;
