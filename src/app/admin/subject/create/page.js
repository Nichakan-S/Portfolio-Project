'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SuccessAlert, WarningAlert } from '../../../components/sweetalert';
import { Button, Card, Select, Input, TimePicker, Row, Col } from 'antd';
import moment from 'moment';

const { Option } = Select;

const CreateSubject = () => {
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [day, setDay] = useState('');
    const [group, setGroup] = useState('');
    const [starttime, setStartTime] = useState(null);
    const [endtime, setEndTime] = useState(null);
    const [term, setTerm] = useState('');
    const [year, setYear] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formattedStartTime = starttime ? moment(starttime).format('HH:mm') : '';
        const formattedEndTime = endtime ? moment(endtime).format('HH:mm') : '';

        try {
            const response = await fetch('/api/subject', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, code, day, group, starttime: formattedStartTime, endtime: formattedEndTime, term: parseInt(term, 10), year: parseInt(year, 10) })
            });
    
            if (!response.ok) throw new Error('Something went wrong');
    
            SuccessAlert('สำเร็จ!', 'ข้อมูลได้ถูกบันทึกแล้ว');
            router.push('/admin/subject');
    
        } catch (error) {
            console.error(error);
            WarningAlert('ผิดพลาด!', 'ไม่สามารถบันทึกข้อมูลได้');
        }
    };

    const handleBack = () => {
        router.push('/admin/subject');
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">เพิ่มวิชาใหม่</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="shadow-xl">
                    <Row gutter={16}>
                        {/* คอลัมน์ซ้าย */}
                        <Col span={12}>
                            <Row align="middle" style={{ marginBottom: '16px' }}>
                                <Col span={8}>
                                    <label className="text-base font-medium text-gray-700">ชื่อวิชา:</label>
                                </Col>
                                <Col span={16}>
                                    <Input
                                        placeholder="ชื่อวิชา"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        size="large"
                                        required
                                    />
                                </Col>
                            </Row>
                            <Row align="middle" style={{ marginBottom: '16px' }}>
                                <Col span={8}>
                                    <label className="text-base font-medium text-gray-700">รหัสวิชา:</label>
                                </Col>
                                <Col span={16}>
                                    <Input
                                        placeholder="รหัสวิชา"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        size="large"
                                        required
                                    />
                                </Col>
                            </Row>
                            <Row align="middle" style={{ marginBottom: '16px' }}>
                                <Col span={8}>
                                    <label className="text-base font-medium text-gray-700">เวลาเริ่ม:</label>
                                </Col>
                                <Col span={16}>
                                    <TimePicker
                                        format="HH:mm"
                                        value={starttime ? moment(starttime, 'HH:mm') : null}
                                        onChange={(time) => setStartTime(time ? time.format('HH:mm') : null)}
                                        style={{ width: '100%' }}
                                        size="large"
                                        required
                                    />
                                </Col>
                            </Row>
                            <Row align="middle" style={{ marginBottom: '16px' }}>
                                <Col span={8}>
                                    <label className="text-base font-medium text-gray-700">เวลาจบ:</label>
                                </Col>
                                <Col span={16}>
                                    <TimePicker
                                        format="HH:mm"
                                        value={endtime ? moment(endtime, 'HH:mm') : null}
                                        onChange={(time) => setEndTime(time ? time.format('HH:mm') : null)}
                                        style={{ width: '100%' }}
                                        size="large"
                                        required
                                    />
                                </Col>
                            </Row>
                        </Col>

                        {/* คอลัมน์ขวา */}
                        <Col span={12}>
                            <Row align="middle" style={{ marginBottom: '16px' }}>
                                <Col span={8}>
                                    <label className="text-base font-medium text-gray-700">วันที่สอน:</label>
                                </Col>
                                <Col span={16}>
                                    <Select
                                        placeholder="เลือกวัน"
                                        value={day}
                                        onChange={setDay}
                                        required
                                        style={{ width: '100%' }}
                                    >
                                        {/** Option items */}
                                        <Option value="mon">จันทร์</Option>
                                        <Option value="tue">อังคาร</Option>
                                        <Option value="wed">พุธ</Option>
                                        <Option value="thu">พฤหัสบดี</Option>
                                        <Option value="fri">ศุกร์</Option>
                                        <Option value="sat">เสาร์</Option>
                                        <Option value="sun">อาทิตย์</Option>
                                    </Select>
                                </Col>
                            </Row>
                            <Row align="middle" style={{ marginBottom: '16px' }}>
                                <Col span={8}>
                                    <label className="text-base font-medium text-gray-700">กลุ่มเรียน:</label>
                                </Col>
                                <Col span={16}>
                                    <Input
                                        placeholder="กลุ่มเรียน"
                                        value={group}
                                        onChange={(e) => setGroup(e.target.value)}
                                        size="large"
                                        required
                                    />
                                </Col>
                            </Row>
                            <Row align="middle" style={{ marginBottom: '16px' }}>
                                <Col span={8}>
                                    <label className="text-base font-medium text-gray-700">เทอม:</label>
                                </Col>
                                <Col span={16}>
                                    <Select
                                        placeholder="เลือกเทอม"
                                        value={term}
                                        onChange={setTerm}
                                        required
                                        style={{ width: '100%' }}
                                    >
                                        <Option value="1">1</Option>
                                        <Option value="2">2</Option>
                                        <Option value="3">3</Option>
                                    </Select>
                                </Col>
                            </Row>
                            <Row align="middle" style={{ marginBottom: '16px' }}>
                                <Col span={8}>
                                    <label className="text-base font-medium text-gray-700">ปีการศึกษา:</label>
                                </Col>
                                <Col span={16}>
                                    <Input
                                        placeholder="ปีการศึกษา"
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        size="large"
                                        required
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', width: '102%' , padding: '15px' }}>
                        <Button 
                            className="inline-flex justify-center mr-4 mb-4"
                            type="primary"
                            size="middle"
                            onClick={handleSubmit}
                            style={{ 
                                color:'white' , 
                                backgroundColor: '#02964F', 
                                borderColor: '#02964F' ,}}
                            >
                            บันทึก
                        </Button>
                        <Button 
                            className="inline-flex justify-center mr-4 mb-4"
                            onClick={handleBack}
                            size="middle"
                            >
                        ยกเลิก
                        </Button>
                    </div>
                </Card>
                
            </form>
        </div>
    );
};

export default CreateSubject;
