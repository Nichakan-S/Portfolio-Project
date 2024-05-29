'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { SuccessAlert, WarningAlert } from '../../components/sweetalert';
import { Input, Button, Select, Col, Card, Row, TimePicker } from 'antd';

const { Option } = Select;

const CreateTeaching = () => {
    const { data: session } = useSession();
    const [teaching, setTeaching] = useState([]);
    const [selectedSubjects, setSelectedSubjects] = useState('');
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [year, setYear] = useState('');
    const [audit] = useState('wait');
    const [group, setGroup] = useState('');
    const [term, setTerm] = useState('');
    const [day, setDay] = useState('');

    useEffect(() => {
        const fetchteaching = async () => {
            const response = await fetch('/api/subject');
            const data = await response.json();
            setTeaching(data);
        };

        fetchteaching();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedSubjects || !start || !end || !year || !audit || !group || !term || !day) {
            WarningAlert('ผิดพลาด!', 'กรุณากรอกข้อมูลให้ครบทุกช่อง');
            return;
        }
        console.log(JSON.stringify({
            starttime: start,
            endtime: end,
            day,
            group,
            term: parseInt(term, 10),
            year: parseInt(year, 10),
            audit,
            subjectsId: selectedSubjects,
            userId: session.user.id
        }))
        try {
            const response = await fetch('/api/teaching', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    starttime: start.toISOString(),
                    endtime: end.toISOString(),
                    day,
                    group,
                    term: parseInt(term, 10),
                    year: parseInt(year, 10),
                    audit,
                    subjectsId: selectedSubjects,
                    userId: session.user.id
                })
            });

            if (!response.ok) throw new Error('Something went wrong');

            SuccessAlert('สำเร็จ!', 'ข้อมูลได้ถูกบันทึกแล้ว');
            window.history.back();
        } catch (error) {
            console.error(error);
            WarningAlert('ผิดพลาด!', 'ไม่สามารถบันทึกข้อมูลได้');
        }
    };

    const handleChange = (value) => {
        setSelectedSubjects(value);
    };

    return (
        <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-2xl font-semibold mb-6">เพิ่มการสอน</h1>
            <div style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card className="max-w-6xl mx-auto px-4 py-8 shadow-xl" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                                    <label htmlFor="subjects" className="block text-base font-medium mr-4 mb-4">
                                        <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> วิชา : </span>
                                    </label>
                                    <Select
                                        value={selectedSubjects}
                                        size="large"
                                        onChange={handleChange}
                                        required
                                        className="flex-grow mr-4 mb-4 custom-select"
                                        style={{
                                            width: '50%',
                                            borderColor: '#DADEE9',
                                            fontSize: '16px',
                                            height: '40px'
                                        }}
                                    >
                                        {teaching.map(subject => (
                                            <Option key={subject.id} value={subject.id}>
                                                ({subject.code}) {subject.nameTH}
                                            </Option>
                                        ))}
                                    </Select>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                                    <label htmlFor="start" className="block text-base mb-4 mr-4">
                                        <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> เวลาเริ่ม : </span>
                                    </label>
                                    <TimePicker
                                        value={start}
                                        onChange={(time) => setStart(time)}
                                        format="HH:mm"
                                        minuteStep={5}
                                        required
                                        className="py-2 px-4 flex-grow mr-4 mb-4"
                                    />
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                                    <label htmlFor="group" className="block text-base font-medium mr-4">
                                        <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> กลุ่ม : </span>
                                    </label>
                                    <Input
                                        placeholder="กลุ่ม"
                                        size="large"
                                        name="group"
                                        id="group"
                                        required
                                        value={group}
                                        onChange={(e) => setGroup(e.target.value)}
                                        className="flex-grow mr-4 mb-4"
                                    />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
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
                                        className="flex-grow mr-4 mb-4"
                                    />
                                </div>
                                
                            </Col>
                            <Col span={12}>
                                <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                                    <label htmlFor="day" className="block text-base font-medium mr-4 mb-4">
                                        <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> วัน : </span>
                                    </label>
                                    <Select
                                        value={day}
                                        size="large"
                                        onChange={(value) => setDay(value)}
                                        required
                                        className="flex-grow mr-4 mb-4 custom-select"
                                        style={{
                                            width: '50%',
                                            borderColor: '#DADEE9',
                                            fontSize: '16px',
                                            height: '40px'
                                        }}
                                    >
                                        <Option value="mon">จันทร์</Option>
                                        <Option value="tue">อังคาร</Option>
                                        <Option value="wed">พุธ</Option>
                                        <Option value="thu">พฤหัสบดี</Option>
                                        <Option value="fri">ศุกร์</Option>
                                        <Option value="sat">เสาร์</Option>
                                        <Option value="sun">อาทิตย์</Option>
                                    </Select>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                                    <label htmlFor="end" className="block text-base font-medium mr-4 mb-4">
                                        <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> สิ้นสุดเวลา : </span>
                                    </label>
                                    <TimePicker
                                        value={end}
                                        onChange={(time) => setEnd(time)}
                                        format="HH:mm"
                                        minuteStep={5}
                                        required
                                        className="py-2 px-4 flex-grow mr-4 mb-4"
                                    />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                                    <label htmlFor="term" className="block text-base font-medium mr-4 mb-4">
                                        <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> เทอม : </span>
                                    </label>
                                    <Select
                                        value={term}
                                        size="large"
                                        onChange={(value) => setTerm(value)}
                                        required
                                        className="flex-grow mr-4 mb-4 custom-select"
                                        style={{
                                            width: '50%',
                                            borderColor: '#DADEE9',
                                            fontSize: '16px',
                                            height: '40px'
                                        }}
                                    >
                                        <Option value="1">1</Option>
                                        <Option value="2">2</Option>
                                        <Option value="3">3</Option>
                                    </Select>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'left', width: '50%', marginBottom: '16px' }}>
                                    <Button className="inline-flex justify-center mr-4"
                                        type="primary"
                                        size="middle"
                                        onClick={handleSubmit}
                                        style={{ backgroundColor: '#00B96B', borderColor: '#00B96B' }}
                                    >
                                        บันทึก
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

export default CreateTeaching;
