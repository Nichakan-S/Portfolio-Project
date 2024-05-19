'use client'

import React, { useEffect, useState } from 'react';
import { SuccessAlert, WarningAlert, ConfirmAlert } from '../../../../components/sweetalert';
import { Select, Button, Modal, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const EditMajor = ({ params }) => {
    const { id } = params;
    const [file, setFile] = useState('');
    const [activity, setActivity] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState('');
    const [status] = useState('wait');
    const [previewFile, setPreviewFile] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            const res = await fetch('/api/activity');
            const data = await res.json();
            setActivity(data);
        };

        const fetchActivityDetails = async (id) => {
            const res = await fetch(`/api/manageActivity/${id}`);
            const data = await res.json();
            setFile(data.file);
            setSelectedActivity(data.activityId);
            setIsLoading(false);
        };

        fetchActivities();
        if (id) {
            fetchActivityDetails(id);
        }
    }, [id]);

    useEffect(() => {
        if (file) {
            setPreviewFile(file);
        }
    }, [file]);
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedActivity) {
            WarningAlert('ผิดพลาด!', 'กรุณาเลือกกิจกรรม');
            return;
        }
    
        console.log(JSON.stringify({ activityId: selectedActivity, file, status }));
        try {
            const response = await fetch(`/api/manageActivity/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ activityId: selectedActivity, file, status })
            });
    
            if (!response.ok) throw new Error('Something went wrong');
    
            SuccessAlert('สำเร็จ!', 'ข้อมูลได้ถูกอัปเดตแล้ว');
            window.history.back();
        } catch (error) {
            console.error(error);
            WarningAlert('ผิดพลาด!', 'ไม่สามารถอัปเดตข้อมูลได้');
        }
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
    
    const handleBack = () => {
        window.history.back();
    };

    const activityOptions = activity.map(fac => ({
        label: fac.name,
        value: fac.id,
        disabled: fac.disabled
    }));

    const handleDelete = async () => {
        ConfirmAlert('คุณแน่ใจที่จะลบข้อมูลนี้?', 'การดำเนินการนี้ไม่สามารถย้อนกลับได้', async () => {
          try {
            const response = await fetch(`/api/manageActivity/${id}`, {
              method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete the manageActivity.');
            SuccessAlert('ลบสำเร็จ!', 'ข้อมูลถูกลบแล้ว');
            window.history.back();
          } catch (error) {
            console.error('Failed to delete the manageActivity', error);
            WarningAlert('ผิดพลาด!', 'ไม่สามารถลบข้อมูลได้');
          }
        });
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
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">{id ? 'แก้ไขกิจกรรม' : 'เพิ่มกิจกรรม'}</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="activity" className="block text-base font-medium text-gray-700 mr-2 mb-4">
                        เลือกกิจกรรม
                    </label>
                    <Select
                        value={selectedActivity}
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

export default EditMajor;
