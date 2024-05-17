'use client'

import React, { useEffect, useState } from 'react';
import { Select, Empty, Card } from 'antd';

const { Option } = Select;

const DayEnum = {
    mon: 'จันทร์',
    tue: 'อังคาร',
    wed: 'พุธ',
    thu: 'พฤหัสบดี',
    fri: 'ศุกร์',
    sat: 'เสาร์',
    sun: 'อาทิตย์',
};

const TeachingList = ({ params }) => {
    const [teaching, setTeaching] = useState([]);
    const [activity, setActivity] = useState([]);
    const [research, setResearch] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState(null);
    const { id } = params;

    const fetchactivity = async (id) => {
        try {
            const response = await fetch(`/api/homeActivity/${id}`);
            const data = await response.json();
            console.log('activity data fetched:', data);
            setActivity(data);
        } catch (error) {
            console.error('Failed to fetch activity', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchresearch = async (id) => {
        try {
            const response = await fetch(`/api/homeReseardh/${id}`);
            const data = await response.json();
            console.log('research data fetched:', data);
            setResearch(data);
        } catch (error) {
            console.error('Failed to fetch research', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchteaching = async (id) => {
        try {
            const response = await fetch(`/api/userTeaching/${id}`);
            const data = await response.json();
            console.log('teaching data fetched:', data);
            setTeaching(data);
        } catch (error) {
            console.error('Failed to fetch teaching', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchteaching(parseInt(id));
            fetchactivity(parseInt(id));
            fetchresearch(parseInt(id));
        }
    }, [id]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    const calculateTimeSlots = (startTime, endTime) => {
        const start = startTime.split(':');
        const end = endTime.split(':');
        const startMinutes = parseInt(start[0]) * 60 + parseInt(start[1]);
        const endMinutes = parseInt(end[0]) * 60 + parseInt(end[1]);
        return Math.ceil((endMinutes - startMinutes) / 60);
    };

    const checkTimeOverlap = (sessionStart, sessionEnd, slotStart, slotEnd) => {
        const sessionStartMin = parseInt(sessionStart.split(':')[0]) * 60 + parseInt(sessionStart.split(':')[1]);
        const sessionEndMin = parseInt(sessionEnd.split(':')[0]) * 60 + parseInt(sessionEnd.split(':')[1]);
        const slotStartMin = parseInt(slotStart.split(':')[0]) * 60;
        const slotEndMin = parseInt(slotEnd.split(':')[0]) * 60;

        return sessionStartMin < slotEndMin && sessionEndMin > slotStartMin;
    };

    const renderedSessions = new Map();

    const times = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '19:00', '20:00', '21:00'];
    const fullTimes = ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00', '19:00-20:00', '20:00-21:00', '21:00-22:00'];
    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

    const calculateTotalTeachingHours = (teaching) => {
        return teaching.reduce((total, session) => {
            const startTime = session.subjects.starttime.split(':');
            const endTime = session.subjects.endtime.split(':');
            const startMinutes = parseInt(startTime[0]) * 60 + parseInt(startTime[1]);
            const endMinutes = parseInt(endTime[0]) * 60 + parseInt(endTime[1]);
            const sessionHours = (endMinutes - startMinutes) / 60;
            return total + sessionHours;
        }, 0);
    };

    const totalTeachingHours = calculateTotalTeachingHours(teaching);

    const filteredTeaching = selectedYear ? teaching.filter(t => t.subjects.year === selectedYear) : teaching;

    const years = [...new Set(teaching.map(t => t.subjects.year))];

    return (
        <div className="px-4">
            <div className="flex items-center mb-6">
                <h1 className="text-2xl font-semibold mr-4">กราฟผลงานทั้งหมด</h1>
                <Select
                placeholder="เลือกปี"
                onChange={value => setSelectedYear(value)}
                style={{ width: 200}}
            >
                {years.map(year => (
                    <Option key={year} value={year}>{year}</Option>
                ))}
            </Select>
            </div>
            <div className="mx-auto shadow-md">
                <table className="w-full rounded-lg border-collapse overflow-hidden">
                    <thead className="rounded-t-lg">
                        <tr>
                            <th className="bg-gray-950 text-white h-12">Day/Time</th>
                            {times.map(time => (
                                <th key={time} className="p-2 bg-gray-950 text-xs text-white h-12">{time}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="rounded-b-lg">
                        {days.map(day => (
                            <tr key={day} className="bg-gray-200 h-10">
                                <td className="p-2 uppercase bg-gray-700 text-white h-10">{DayEnum[day]}</td>
                                {fullTimes.map((time, index) => {
                                    const timeRange = time.split('-');
                                    const timeStart = timeRange[0];
                                    const timeEnd = timeRange[1];
                                    const session = filteredTeaching.find(s => s.subjects.day === day.toLowerCase() && checkTimeOverlap(s.subjects.starttime, s.subjects.endtime, timeStart, timeEnd));

                                    if (session && !renderedSessions.has(`${day}-${index}`)) {
                                        const colspan = calculateTimeSlots(session.subjects.starttime, session.subjects.endtime);
                                        for (let i = 0; i < colspan; i++) {
                                            renderedSessions.set(`${day}-${index + i}`, true);
                                        }
                                        return (
                                            <td key={time} colSpan={colspan} title={`เวลาเริ่ม: ${session.subjects.starttime}, เวลาจบ: ${session.subjects.endtime}`} className="p-2 bg-blue-200 text-center border-x-2 h-10">
                                                {`${session.subjects.name}, ${session.subjects.group}`}
                                            </td>
                                        );
                                    }
                                    return !renderedSessions.has(`${day}-${index}`) ? <td key={time} className="p-2 bg-gray-200 h-10"></td> : null;
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex mt-8 w-full h-24">
                <div className="p-4 mr-4 bg-white rounded-lg shadow-xl flex-1">
                    <div className="text-gray-500 text-sm">ผลงานทั้งหมด</div>
                    <div className="text-2xl font-bold text-right">{activity.length + research.length}</div>
                </div>
                <div className="p-4 mr-4 bg-white rounded-lg shadow-xl flex-1">
                    <div className="text-gray-500 text-sm">ผลงานวิจัย</div>
                    <div className="text-2xl font-bold text-right">{research.length}</div>
                </div>
                <div className="p-4 mr-4 bg-white rounded-lg shadow-xl flex-1">
                    <div className="text-gray-500 text-sm">ผลงานกิจกรรม</div>
                    <div className="text-2xl font-bold text-right">{activity.length}</div>
                </div>
                <div className="p-4 mr-4 bg-white rounded-lg shadow-xl flex-1">
                    <div className="text-gray-500 text-sm">วิชาที่สอน</div>
                    <div className="text-2xl font-bold text-right">{teaching.length}</div>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-xl flex-1">
                    <div className="text-gray-500 text-sm">รวมชั่วโมง</div>
                    <div className="text-2xl font-bold text-right">{totalTeachingHours}</div>
                </div>
            </div>
        </div>
    );
};

export default TeachingList;
