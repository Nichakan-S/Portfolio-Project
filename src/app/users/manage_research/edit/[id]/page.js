'use client'

import React, { useEffect, useState } from 'react';
import { SuccessAlert, WarningAlert, ConfirmAlert} from '../../../../components/sweetalert';
import { Input, Button, Upload, Modal, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;

const EditResearch = ({ params }) => {
    const [nameTH, setNameTH] = useState('');
    const [nameEN, setNameEN] = useState('');
    const [researchfund, setResearchfund] = useState('');
    const [type, setType] = useState('');
    const [file, setFile] = useState('');
    const [year, setYear] = useState('');
    const [status] = useState('wait');
    const [previewFile, setPreviewFile] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [customFund, setCustomFund] = useState('');
    const { id } = params;
    const [isLoading, setIsLoading] = useState(true);

    const fetchResearch = async (id) => {
        try {
            const response = await fetch(`/api/research/${id}`);
            const data = await response.json();
            if (!response.ok) throw new Error('Failed to fetch research data');
            setNameTH(data.nameTH);
            setNameEN(data.nameEN);
            setResearchfund(data.researchfund);
            setType(data.type);
            setFile(data.file);
            setYear(data.year);
            setPreviewFile(data.file);
        } catch (error) {
            console.error('Error fetching research data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchResearch(parseInt(id));
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const thaiYear = parseInt(year, 10);
        console.log(JSON.stringify({
            nameTH,
            nameEN,
            researchfund: researchfund === 'other' ? customFund : researchfund,
            type,
            file,
            year: thaiYear,
            status
        }))
        try {
            const response = await fetch(`/api/research/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nameTH,
                    nameEN,
                    researchfund: researchfund === 'other' ? customFund : researchfund,
                    type,
                    file,
                    year: thaiYear,
                    status
                })
            });

            if (!response.ok) throw new Error('Something went wrong');

            SuccessAlert('สำเร็จ!', 'ข้อมูลได้ถูกอัปเดตแล้ว');
            window.history.back();
        } catch (error) {
            console.error(error);
            WarningAlert('ผิดพลาด!', 'ไม่สามารถอัปเดตข้อมูลได้');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResearchFundChange = (e) => {
        const value = e.target.value;
        if (value === 'other') {
            setCustomFund('');
            setResearchfund(value);
        } else {
            setResearchfund(value);
            setCustomFund('');
        }
    };
    
    const handleCustomFundChange = (e) => {
        const value = e.target.value;
        setCustomFund(value);
    };
    

    const handleBack = () => {
        window.history.back();
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

    const yearOptions = [];
    const currentYear = moment().year();
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
        const thaiYear = moment(i.toString()).add(543, 'years').format('YYYY');
        yearOptions.push(<Option key={i} value={i}>{thaiYear}</Option>);
    }

    const handleDelete = async () => {
        ConfirmAlert('คุณแน่ใจที่จะลบข้อมูลนี้?', 'การดำเนินการนี้ไม่สามารถย้อนกลับได้', async () => {
          try {
            const response = await fetch(`/api/research/${id}`, {
              method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete the research.');
            SuccessAlert('ลบสำเร็จ!', 'ข้อมูลถูกลบแล้ว');
            window.history.back();
          } catch (error) {
            console.error('Failed to delete the research', error);
            WarningAlert('ผิดพลาด!', 'ไม่สามารถลบข้อมูลได้');
          }
        });
      };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">เพิ่มงานวิจัยใหม่</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="nameTH" className="block text-base font-medium text-gray-700 mb-4">
                        ชื่องานวิจัย (ไทย)
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
                    />
                </div>
                <div>
                    <label htmlFor="nameEN" className="block text-base font-medium text-gray-700 mb-4">
                        ชื่องานวิจัย (อังกฤษ)
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
                    />
                </div>
                <div>
                    <label htmlFor="researchfund">ทุน</label>
                    <select
                        value={researchfund !== 'other' ? researchfund : ''}
                        onChange={handleResearchFundChange}
                        required
                    >
                        <option value="">เลือกประเภท</option>
                        <option value="ทุนภายใน">ทุนภายใน</option>
                        <option value="ทุนภายนอก">ทุนภายนอก</option>
                        <option value="other">อื่นๆ (โปรดระบุ)</option>
                    </select>
                    {researchfund === 'other' && (
                        <input
                            type="text"
                            value={customFund}
                            onChange={handleCustomFundChange}
                            placeholder="ระบุทุน"
                            required
                        />
                    )}
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
                        <option value="journalism">สื่อสารมวลชน</option>
                        <option value="researchreports">รายงานการวิจัย</option>
                        <option value="posterpresent">โปสเตอร์ปัจจุบัน</option>
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
                    <label htmlFor="year" className="block text-base font-medium text-gray-700 mb-4">
                        ปี
                    </label>
                    <Select
                        placeholder="เลือกปี"
                        style={{ width: 200 }}
                        required
                        value={year}
                        onChange={(value) => setYear(value)}
                    >
                        {yearOptions}
                    </Select>
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

export default EditResearch;
