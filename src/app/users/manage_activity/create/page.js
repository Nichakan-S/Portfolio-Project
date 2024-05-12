'use client'

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { SuccessAlert, WarningAlert } from '../../../components/sweetalert';
import { Select, Button, Modal, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const CreateActivity = () => {
    const { data: session } = useSession();
    const [file, setFile] = useState('');
    const [activity, setActivity] = useState([]);
    const [status] = useState('wait');
    const [previewFile, setPreviewFile] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState('');

    useEffect(() => {
        const fetchactivity = async () => {
            const response = await fetch('/api/activity');
            const data = await response.json();
            setActivity(data);
        };

        fetchactivity();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedActivity) {
            WarningAlert('ผิดพลาด!', 'กรุณาเลือกกิจกรรม');
            return;
        }
        console.log(JSON.stringify({ activityId: selectedActivity, userId: session.user.id, file, status }))
        try {
            const response = await fetch('/api/manageActivity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ activityId: selectedActivity, userId: session.user.id, file, status })
            });

            if (!response.ok) throw new Error('Something went wrong');

            SuccessAlert('สำเร็จ!', 'ข้อมูลได้ถูกบันทึกแล้ว');
            window.history.back();
        } catch (error) {
            console.error(error);
            WarningAlert('ผิดพลาด!', 'ไม่สามารถบันทึกข้อมูลได้');
        }
    };

    const handleBack = () => {
        window.history.back();
    };

    const handleChange = (value) => {
        setSelectedActivity(value);
        console.log(`selected ${value}`);
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

    const activityOptions = activity.map(fac => ({
        label: fac.name,
        value: fac.id,
        disabled: fac.disabled
    }));


    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">เพิ่มกิจกรรม</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="activity" className="block text-base font-medium text-gray-700 mr-2 mb-4">
                        เลือกกิจกรรม
                    </label>
                    <Select
                        defaultValue="กรุณาเลือกกิจกรรม"
                        style={{ width: '100%' }}
                        size="large"
                        onChange={handleChange}
                        options={[{ value: '', label: 'กรุณาเลือกกิจกรรม', disabled: true }, ...activityOptions]}
                    />
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
                    <Button className="inline-flex justify-center mr-4 "
                        type="primary"
                        size="middle"
                        onClick={handleSubmit}
                        style={{ backgroundColor: '#00B96B', borderColor: '#00B96B' }}
                    >
                        บันทึก
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

export default CreateActivity;
