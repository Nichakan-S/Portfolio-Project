'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'
import { SuccessAlert, WarningAlert } from '../../../components/sweetalert';
import { Input , Button, Select, TimePicker } from 'antd';

import moment from 'moment';

const { Option } = Select;

const CreateSubject = () => {
    const [subjectName, setSubjectName] = useState('');
    const [day, setDay] = useState('');
    const [group, setGroup] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [term, setTerm] = useState('');
    const [year, setYear] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/subject', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ subjectName, day, group, startTime, endTime, term, year })
            });

            if (!response.ok) throw new Error('Something went wrong');

            SuccessAlert('Success!', 'Data has been saved successfully');
            router.push('/admin/subject');

        } catch (error) {
            console.error(error);
            WarningAlert('Error!', 'Failed to save data');
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
                    <label htmlFor="subjectName" className="block text-base font-medium text-gray-700 mb-4">
                        Subject Name
                    </label>
                    <Input
                        placeholder="Subject Name"
                        size="large"
                        type="text"
                        name="subjectName"
                        id="subjectName"
                        required
                        value={subjectName}
                        onChange={(e) => setSubjectName(e.target.value)}
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
                        value={startTime}
                        onChange={(time) => setStartTime(time)}
                    />
                </div>
                <div>
                    <label htmlFor="endTime" className="block text-base font-medium text-gray-700 mb-4">
                        End Time
                    </label>
                    <TimePicker
                        placeholder="End Time"
                        format="HH:mm"
                        value={endTime}
                        onChange={(time) => setEndTime(time)}
                    />
                </div>
                <div>
                    <label htmlFor="term" className="block text-base font-medium text-gray-700 mb-4">
                        Term
                    </label>
                    <Select
                        placeholder="Select term"
                        style={{ width: 200 }}
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
