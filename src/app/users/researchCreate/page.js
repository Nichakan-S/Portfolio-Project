'use client'

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { SuccessAlert, WarningAlert } from '../../components/sweetalert';
import { Input, Button, Upload, Modal, Select } from 'antd';
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
    const [audit] = useState('wait');
    const [approve] = useState('wait');
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
            audit,
            approve
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
                    audit,
                    approve
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

    const handleresearchFundChange = (e) => {
        const value = e.target.value;
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
                    <label htmlFor="researchFund">ทุน</label>
                    <select
                        value={researchFund !== 'other' ? researchFund : ''}
                        onChange={handleresearchFundChange}
                        required
                    >
                        <option value="">เลือกประเภท</option>
                        <option value="ทุนภายใน">ทุนภายใน</option>
                        <option value="ทุนภายนอก">ทุนภายนอก</option>
                        <option value="other">อื่นๆ (โปรดระบุ)</option>
                    </select>
                    {researchFund === 'other' && (
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
                </div>
            </form>
        </div>
    );
};

export default CreateResearch;