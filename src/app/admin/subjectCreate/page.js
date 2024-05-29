'use client'

import React, { useState, useEffect } from 'react';
import { SuccessAlert, WarningAlert } from '../../components/sweetalert';
import { Input, Button, Card, Select } from 'antd';

const CreateSubject = () => {
    const [nameTH, setNameTH] = useState('');
    const [nameEN, setNameEN] = useState('');
    const [code, setCode] = useState('');
    const [major, setMajor] = useState([]);
    const [majorId, setMajorId] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchMajor();
    }, []);

    const fetchMajor = async () => {
        try {
            const res = await fetch('/api/major');
            const data = await res.json();
            setMajor(data);
        } catch (error) {
            console.error('Failed to fetch major', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/subject', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nameTH, nameEN, code, majorId })
            });

            if (!response.ok) throw new Error('Something went wrong');

            SuccessAlert('สำเร็จ!', 'ข้อมูลได้ถูกบันทึกแล้ว');

            setNameTH('');
            setNameEN('');
            setCode('');
            setMajorId('');
        } catch (error) {
            console.error(error);
            WarningAlert('ผิดพลาด!', 'ไม่สามารถบันทึกข้อมูลได้');
        }
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
            <h1 className="text-3xl font-bold mb-6" style={{ color: "#2D427C" }}>เพิ่มวิชาใหม่</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="max-w-6xl mx-auto px-4 py-8 shadow-xl">
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                            <label htmlFor="major" className="block text-base font-medium mr-4 mb-4">
                                <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> สาขา : </span>
                            </label>
                            <Select
                                id="major"
                                value={majorId}
                                onChange={(newMajorId) => setMajorId(newMajorId)}
                                className="flex-grow mr-4 mb-4 custom-select"
                                size="large"
                                style={{
                                    width: '80%',
                                    borderColor: '#DADEE9',
                                    fontSize: '16px',
                                    height: '40px'
                                }}>
                                <Select.Option value="">กรุณาเลือกสาขา</Select.Option>
                                {major.map((major) => (
                                    <Select.Option key={major.id} value={major.id}>
                                        {major.majorName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                            <label htmlFor="nameTH" className="block mr-4 mb-4">
                                <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> ชื่อวิชาภาษาไทย : </span>
                            </label>
                            <Input
                                placeholder="ชื่อภาษาไทย"
                                size="large"
                                name="nameTH"
                                id="nameTH"
                                required
                                value={nameTH}
                                onChange={(e) => setNameTH(e.target.value)}
                                className="flex-grow mr-4 mb-4"
                                showCount
                                maxLength={60}
                                style={{
                                    flexGrow: 1,
                                    flexShrink: 1,
                                    flexBasis: '50%',
                                    minWidth: '300px',
                                    fontSize: '16px',
                                    height: '40px'
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                            <label htmlFor="nameEN" className="block mr-4 mb-4">
                                <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> ชื่อวิชาภาษาอังกฤษ : </span>
                            </label>
                            <Input
                                placeholder="ชื่อภาษาอังกฤษ"
                                size="large"
                                name="nameEN"
                                id="nameEN"
                                required
                                value={nameEN}
                                onChange={(e) => setNameEN(e.target.value)}
                                className="flex-grow mr-4 mb-4"
                                showCount
                                maxLength={60}
                                style={{
                                    flexGrow: 1,
                                    flexShrink: 1,
                                    flexBasis: '50%',
                                    minWidth: '300px',
                                    fontSize: '16px',
                                    height: '40px'
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <label htmlFor="code" className="block text-base font-medium text-gray-700 mb-4 mr-4">
                                <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> รหัสวิชา : </span>
                            </label>
                            <Input
                                placeholder="รหัสวิชา "
                                size="large"
                                name="code"
                                id="code"
                                required
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                showCount
                                maxLength={8}
                                className="flex-grow mr-4 mb-4"
                                style={{
                                    flexGrow: 1,
                                    flexShrink: 1,
                                    flexBasis: '50%',
                                    minWidth: '300px',
                                    fontSize: '16px',
                                    height: '40px'
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%', padding: '8px 0' }}>
                            <Button className="inline-flex justify-center mr-4 "
                                type="primary"
                                size="middle"
                                onClick={handleSubmit}
                                style={{ backgroundColor: '#00B96B', borderColor: '#00B96B' }}
                            >
                                บันทึก
                            </Button>
                        </div>
                    </div>
                </Card>
            </form>
        </div>
    );
};

export default CreateSubject;
