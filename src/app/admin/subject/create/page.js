'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'
import { SuccessAlert, WarningAlert } from '../../../components/sweetalert';
import { Input, Button, Select, TimePicker } from 'antd';

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
                <div>
                    <label htmlFor="name" className="block text-base font-medium text-gray-700 mb-4">
                        Subject Name
                    </label>
                    <Input
                        placeholder="Subject Name"
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
                    <label htmlFor="code" className="block text-base font-medium text-gray-700 mb-4">
                        รหัสวิชา
                    </label>
                    <Input
                        placeholder="รหัสวิชา "
                        size="large"
                        type="text"
                        name="code"
                        id="code"
                        required
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="day" className="block text-base font-medium text-gray-700 mb-4">
                        Day
                    </label>
                    <Select
                        placeholder="Select Day"
                        style={{ width: 200 }}
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
                <div>
                    <label htmlFor="group" className="block text-base font-medium text-gray-700 mb-4">
                        Group
                    </label>
                    <Input
                        placeholder="Group"
                        size="large"
                        type="text"
                        name="group"
                        id="group"
                        required
                        value={group}
                        onChange={(e) => setGroup(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="startTime" className="block text-base font-medium text-gray-700 mb-4">
                        Start Time
                    </label>
                    <TimePicker
                        placeholder="Start Time"
                        format="HH:mm"
                        required
                        value={starttime ? moment(starttime, 'HH:mm') : null}
                        onChange={(time) => setStartTime(time ? time.format('HH:mm') : '')}
                    />
                </div>
                <div>
                    <label htmlFor="endTime" className="block text-base font-medium text-gray-700 mb-4">
                        End Time
                    </label>
                    <TimePicker
                        placeholder="End Time"
                        format="HH:mm"
                        required
                        value={endtime ? moment(endtime, 'HH:mm') : null}
                        onChange={(time) => setEndTime(time ? time.format('HH:mm') : '')}
                    />
                </div>

                <div>
                    <label htmlFor="term" className="block text-base font-medium text-gray-700 mb-4">
                        Term
                    </label>
                    <Select
                        placeholder="Select term"
                        style={{ width: 200 }}
                        required
                        value={term}
                        onChange={(value) => setTerm(value)}
                    >
                        <Option value="1">1</Option>
                        <Option value="2">2</Option>
                        <Option value="3">3</Option>
                    </Select>
                </div>
                <div>
                    <label htmlFor="year" className="block text-base font-medium text-gray-700 mb-4">
                        Year
                    </label>
                    <Select
                        placeholder="Select year"
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
                        onClick={handleBack}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateSubject;
