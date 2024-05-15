'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'
import { SuccessAlert, WarningAlert } from '../../../components/sweetalert';
import { Input, Button, Select, TimePicker , Card } from 'antd';

import moment from 'moment';

const { Option } = Select;

const CreateSubject = () => {
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [day, setDay] = useState('');
    const [group, setGroup] = useState('');
    const [starttime, setStartTime] = useState('');
    const [endtime, setEndTime] = useState('');
    const [term, setTerm] = useState('');
    const [year, setYear] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formattedStartTime = starttime ? moment(starttime, 'HH:mm').format('HH:mm') : '';
        const formattedEndTime = endtime ? moment(endtime, 'HH:mm').format('HH:mm') : '';

        const thaiYear = parseInt(year, 10) + 543;

        try {
            const response = await fetch('/api/subject', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, code, day, group, starttime: formattedStartTime, endtime: formattedEndTime, term: parseInt(term, 10), year: thaiYear })
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

    const yearOptions = [];
    const currentYear = moment().year();
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
        const thaiYear = moment(i.toString()).add(543, 'years').format('YYYY');
        yearOptions.push(<Option key={i} value={i}>{thaiYear}</Option>);
    }


    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">Add New Subject</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="max-w-6xl mx-auto px-4 py-8 shadow-xl" >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                            <label htmlFor="name" className="block mr-4 mb-4">
                                <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> ชื่อวิชา : </span>
                            </label>
                            <Input
                                placeholder="Subject Name"
                                size="large"
                                name="name"
                                id="name"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="flex-grow mr-4 mb-4"
                                showCount
                                maxLength={100}
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
                            <label htmlFor="code" className="block text-base font-medium text-gray-700 mb-4">
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
                                maxLength={20}
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
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <label htmlFor="day" style={{ width: '20%' }} className="text-base font-medium text-gray-700 mr-2">
                                <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> วัน :</span>
                            </label>
                            <Select
                                placeholder="Select Day"
                                style={{ width: '80%' }}
                                value={day}
                                required
                                onChange={(value) => setDay(value)}
                            >
                                <Option value="mon">Monday</Option>
                                <Option value="tue">Tuesday</Option>
                                <Option value="wed">Wednesday</Option>
                                <Option value="thu">Thursday</Option>
                                <Option value="fri">Friday</Option>
                                <Option value="sat">Saturday</Option>
                                <Option value="sun">Sunday</Option>
                            </Select>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <label htmlFor="group" style={{ width: '20%' }} className="text-base font-medium text-gray-700 mr-2">
                                <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> กลุ่มเรียน :</span>
                            </label>
                            <Input
                                placeholder="Group"
                                size="large"
                                name="group"
                                id="group"
                                required
                                value={group}
                                onChange={(e) => setGroup(e.target.value)}
                                maxLength={6}
                                style={{ width: '80%' }}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <label htmlFor="startTime" className="block text-base font-medium text-gray-700 mb-4">
                                <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> เวลาเริ่ม : </span>
                            </label>
                            <TimePicker
                                placeholder="Start Time"
                                format="HH:mm"
                                required
                                value={starttime ? moment(starttime, 'HH:mm') : null}
                                onChange={(time) => setStartTime(time ? time.format('HH:mm') : '')}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <label htmlFor="endTime" className="block text-base font-medium text-gray-700 mb-4">
                                <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> สิ้นสุดเวลา : </span>
                            </label>
                            <TimePicker
                                placeholder="End Time"
                                format="HH:mm"
                                required
                                value={endtime ? moment(endtime, 'HH:mm') : null}
                                onChange={(time) => setEndTime(time ? time.format('HH:mm') : '')}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <label htmlFor="term" className="block text-base font-medium text-gray-700 mb-4">
                                <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> ภาคเรียน : </span>
                            </label>
                            <Select
                                placeholder="Select term"
                                // style={{ width: 200 }}
                                required
                                value={term}
                                onChange={(value) => setTerm(value)}
                                className="flex-grow mr-4 mb-4"
                                style={{
                                    flexGrow: 1,
                                    flexShrink: 1,
                                    flexBasis: '50%',
                                    minWidth: '300px',
                                    fontSize: '16px',
                                    height: '40px'
                                }}
                                
                            >
                                <Option value="1">1</Option>
                                <Option value="2">2</Option>
                                <Option value="3">3</Option>
                            </Select>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <label htmlFor="year" className="block text-base font-medium text-gray-700 mb-4">
                                <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> ปีการศึกษา : </span>
                            </label>
                            <Select
                                placeholder="Select year"
                                // style={{ width: 200 }}
                                required
                                value={year}
                                onChange={(value) => setYear(value)}
                                className="flex-grow mr-4 mb-4"
                                style={{
                                    flexGrow: 1,
                                    flexShrink: 1,
                                    flexBasis: '50%',
                                    minWidth: '300px',
                                    fontSize: '16px',
                                    height: '40px'
                                }}
                            >
                                {yearOptions}
                            </Select>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' , padding: '8px 0' }}>
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
                                Cancel
                            </Button>
                        </div>
                    </div>
                </Card>
            </form>
        </div>
    );
};

export default CreateSubject;