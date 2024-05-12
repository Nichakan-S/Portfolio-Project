'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SuccessAlert, WarningAlert, ConfirmAlert } from '../../../components/sweetalert';
import { Input, Button, DatePicker, Upload, Modal, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;

const EditActivity = ({ params }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [file, setFile] = useState('');
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [year, setYear] = useState('');
    const [previewFile, setPreviewFile] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const router = useRouter();
    const { id } = params;
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchActivity(id);
        }
    }, [id]);

    const fetchActivity = async (id) => {
        try {
            const response = await fetch(`/api/activity/${id}`);
            if (!response.ok) throw new Error('Something went wrong');

            const data = await response.json();
            setName(data.name);
            setType(data.type);
            setStart(moment(data.start));
            setEnd(moment(data.end));
            setYear(data.year);
            setFile(data.file);
            setPreviewFile(data.file);

        } catch (error) {
            console.error(error);
            WarningAlert('ผิดพลาด!', 'ไม่สามารถดึงข้อมูลกิจกรรมได้');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/activity/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, type, file, start, end, year: parseInt(year, 10) })
            });

            if (!response.ok) throw new Error('Something went wrong');

            SuccessAlert('สำเร็จ!', 'ข้อมูลได้ถูกบันทึกแล้ว');
            router.push('/admin/activity');

        } catch (error) {
            console.error(error);
            WarningAlert('ผิดพลาด!', 'ไม่สามารถบันทึกข้อมูลได้');
        }
    };

    const handleBack = () => {
        router.push('/admin/activity');
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

    const handleDelete = async () => {
        ConfirmAlert('คุณแน่ใจที่จะลบข้อมูลนี้?', 'การดำเนินการนี้ไม่สามารถย้อนกลับได้', async () => {
          try {
            const response = await fetch(`/api/activity/${id}`, {
              method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete the activity.');
            SuccessAlert('ลบสำเร็จ!', 'ข้อมูลถูกลบแล้ว');
            router.push('/admin/activity');
          } catch (error) {
            console.error('Failed to delete the activity', error);
            WarningAlert('ผิดพลาด!', 'ไม่สามารถลบข้อมูลได้');
          }
        });
      };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">เพิ่มกิจกรรมใหม่</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-base font-medium text-gray-700 mb-4">
                        ชื่อกิจกรรม
                    </label>
                    <Input
                        placeholder="ชื่อกิจกรรม"
                        size="large"
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="type" className="block text-base font-medium text-gray-700 mb-4">
                        ประเภท
                    </label>
                    <select
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        required
                    >
                        <option value="">เลือกประเภท</option>
                        <option value="culture">ศิลปะวัฒนธรรม</option>
                        <option value="service">บริการวิชาการ</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="file" className="block text-base font-medium text-gray-700 mb-4">
                        ไฟล์ PDF
                    </label>
                    <Upload
                        customRequest={customRequest}
                        beforeUpload={beforeUpload}
                        showUploadList={false}
                    >
                        <Button icon={<UploadOutlined />}>เลือกไฟล์</Button>
                    </Upload>
                    <Button onClick={() => setModalVisible(true)}>ดูตัวอย่างไฟล์ PDF</Button>
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
                <div>
                    <label htmlFor="start" className="block text-base font-medium text-gray-700 mb-4">
                        เริ่ม
                    </label>
                    <DatePicker
                        style={{ width: '100%' }}
                        showTime
                        format="YYYY-MM-DD HH:mm"
                        value={start ? moment(start) : null}
                        onChange={(date, dateString) => setStart(dateString)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="end" className="block text-base font-medium text-gray-700 mb-4">
                        สิ้นสุด
                    </label>
                    <DatePicker
                        style={{ width: '100%' }}
                        showTime
                        format="YYYY-MM-DD HH:mm"
                        value={end ? moment(end) : null}
                        onChange={(date, dateString) => setEnd(dateString)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="year" className="block text-base font-medium text-gray-700 mb-4">
                        ปี
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
                <div>
                    <Button className="inline-flex justify-center mr-4 "
                        type="primary"
                        size="middle"
                        onClick={handleSubmit}
                        style={{ backgroundColor: '#00B96B', borderColor: '#00B96B' }}
                    >
                        บันทึก
                    </Button>
                    <Button className="inline-flex justify-center mr-4"
                        type="primary" danger
                        size="middle"
                        onClick={handleDelete}
                    >
                        ลบ
                    </Button>
                    <Button className="inline-flex justify-center mr-4"
                        onClick={handleBack}
                    >
                        ยกเลิก
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default EditActivity;