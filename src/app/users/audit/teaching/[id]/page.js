'use client'

import React, { useEffect, useState } from 'react';
import { Button, Input, Select, Card, Descriptions, Tag } from 'antd';
import { SuccessAlert, WarningAlert, EvaluationAlert } from '../../../../components/sweetalert';
import SearchInput from '/src/app/components/SearchInputAll.jsx';

const auditStatus = {
    wait: 'รอตรวจ',
    pass: 'ผ่าน',
    fail: 'ไม่ผ่าน'
};

const StatusColors = {
    wait: 'geekblue',
    pass: 'green',
    fail: 'red'
};

const TeachingList = ({ params }) => {
    const { id } = params;
    const [teaching, setTeaching] = useState([]);
    const [selectTerm, setSelectTerm] = useState('all');
    const [inputTerm, setInputTerm] = useState('');
    const [year, setYear] = useState('all');
    const [term, setTerm] = useState('all');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchteaching(Number(params.id));
    }, [params.id]);

    const fetchteaching = async (id) => {
        if (isNaN(id)) {
            console.error('Invalid majorId:', id);
            setIsLoading(false);
            return;
        }
        try {
            const res = await fetch(`/api/auditTeaching/${id}`);
            if (!res.ok) {
                const errorDetails = await res.json();
                throw new Error(errorDetails.details || 'Unknown error occurred');
            }
            const data = await res.json();
            console.log('teaching data fetched:', data);
            setTeaching(data);
        } catch (error) {
            console.error('Failed to fetch teaching:', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (audit, id) => {
        EvaluationAlert('ยืนยันการประเมิน', 'คุณแน่ใจหรือไม่ที่จะทำการประเมินผลงานนี้?')
            .then(async (result) => {
                if (result.isConfirmed) {
                    console.log(audit, id);
                    try {
                        const response = await fetch(`/api/auditTeaching/${id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ audit })
                        });
                        if (!response.ok) throw new Error('Something went wrong');
                        SuccessAlert('สำเร็จ!', 'ข้อมูลได้ถูกประเมินแล้ว');
                        fetchteaching(params.id);
                    } catch (error) {
                        console.error(error);
                        WarningAlert('ผิดพลาด!', 'ไม่สามารถประเมินข้อมูลได้');
                    }
                }
            }).catch((error) => {
                console.error('Promise error:', error);
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

    const filteredteaching = Array.isArray(teaching) ? teaching.filter((teaching) => {
        return (
            (selectTerm === 'all' || auditStatus[teaching.audit] === selectTerm) &&
            (year === 'all' || teaching.year.toString() === year) &&
            (term === 'all' || teaching.term.toString() === term) &&
            (
                teaching.subjects?.nameTH.toLowerCase().includes(inputTerm.toLowerCase()) ||
                teaching.subjects?.nameEN.toLowerCase().includes(inputTerm.toLowerCase()) ||
                teaching.subjects?.code.toLowerCase().includes(inputTerm.toLowerCase()) ||
                teaching.term.toString().toLowerCase().includes(inputTerm.toLowerCase()) ||
                teaching.group.toLowerCase().includes(inputTerm.toLowerCase()) ||
                teaching.year.toString().toLowerCase().includes(inputTerm.toLowerCase())
            )
        );
    }) : [];

    const uniqueYears = Array.from(new Set(teaching.map(t => t.year.toString())));

    return (
        <div className="max-w-6xl mx-auto px-4 mt-2">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold mb-6" style={{ color: '#2D427C' }}>ตรวจสอบการสอน</h1>
                <div className="flex items-center">
                    <SearchInput
                        value={inputTerm}
                        onChange={(e) => setInputTerm(e.target.value)}
                        placeholder="ค้นหาการสอน..."
                    />
                    <Select
                        value={selectTerm}
                        onChange={(value) => setSelectTerm(value)}
                        className="flex-grow mr-2 w-48"
                        options={[
                            { value: 'all', label: 'ทั้งหมด' },
                            { value: 'รอ', label: 'รอ' },
                            { value: 'ผ่าน', label: 'ผ่าน' },
                            { value: 'ไม่ผ่าน', label: 'ไม่ผ่าน' }
                        ]}
                    />
                    <Select
                        placeholder="เลือกปี"
                        value={year}
                        onChange={value => setYear(value)}
                        className="flex-grow mr-2 w-48"
                    >
                        <Select.Option value="all">ทั้งหมด</Select.Option>
                        {uniqueYears.map(year => (
                            <Select.Option key={year} value={year}>{year}</Select.Option>
                        ))}
                    </Select>
                    <Select
                        placeholder="เลือกเทอม"
                        value={term}
                        onChange={value => setTerm(value)}
                        className="flex-grow w-48"
                    >
                        <Select.Option value="all">ทั้งหมด</Select.Option>
                        <Select.Option value="1">เทอม 1</Select.Option>
                        <Select.Option value="2">เทอม 2</Select.Option>
                        <Select.Option value="3">เทอม 3</Select.Option>
                    </Select>
                </div>
            </div>
            <div style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                {filteredteaching.length > 0 ? (
                    filteredteaching.map((teaching, index) => (
                        <Card
                            key={teaching.id}
                            className="max-w-6xl mx-auto px-4 py-6 shadow-xl small-card"
                            style={{ headerHeight: '38px' }}
                            title={`วิชา: ${teaching.subjects?.nameTH}`}
                        >
                            <Descriptions layout="horizontal" size="small" className="small-descriptions">
                                <Descriptions.Item label="รหัสวิชา">{teaching.subjects?.code}</Descriptions.Item>
                                <Descriptions.Item label="ชื่อวิชา">{teaching.subjects?.nameTH}</Descriptions.Item>
                                <Descriptions.Item label="เทอม">{teaching.term}</Descriptions.Item>
                                <Descriptions.Item label="ปี">{teaching.year}</Descriptions.Item>
                                <Descriptions.Item label="ชื่อผู้สอน">{teaching.user?.username}</Descriptions.Item>
                                <Descriptions.Item label="สถานะ"><Tag color={StatusColors[teaching.audit]}>{auditStatus[teaching.audit]}</Tag></Descriptions.Item>
                            </Descriptions>
                            <div className="text-right">
                                <Button
                                    type="primary"
                                    className="mr-2"
                                    style={{ backgroundColor: '#02964F', borderColor: '#02964F' }}
                                    onClick={() => handleSubmit('pass', teaching.id)}
                                >
                                    ผ่าน
                                </Button>
                                <Button
                                    type="primary"
                                    danger
                                    className="mr-2"
                                    style={{ backgroundColor: '#E50000', borderColor: '#E50000' }}
                                    onClick={() => handleSubmit('fail', teaching.id)}
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
        </div>
    );
}

export default TeachingList;
