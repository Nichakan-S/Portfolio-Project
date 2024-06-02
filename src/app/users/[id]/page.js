'use client'

import React, { useEffect, useState } from 'react';
import { Select } from 'antd';

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
    const [selectedTerm, setSelectedTerm] = useState(null);
    const [auditStatus, setAuditStatus] = useState('');
    const { id } = params;

    const fetchActivity = async (id) => {
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

    const fetchResearch = async (id) => {
        try {
            const response = await fetch(`/api/homeResearch/${id}`);
            const data = await response.json();
            console.log('research data fetched:', data);
            setResearch(data);
        } catch (error) {
            console.error('Failed to fetch research', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTeaching = async (id) => {
        try {
            const response = await fetch(`/api/userTeaching/${id}`);
            const data = await response.json();
            console.log('teaching data fetched:', data);
            setTeaching(data);

            const years = [...new Set(data.map(t => t.year))];
            const recentYear = Math.max(...years);
            setSelectedYear(recentYear);

            setSelectedTerm(1);
        } catch (error) {
            console.error('Failed to fetch teaching', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateAuditStatus = (filteredTeaching) => {
        if (filteredTeaching.length === 0) {
            setAuditStatus('');
            return;
        }
        const audits = filteredTeaching.map(t => t.audit);
        if (audits.every(audit => audit === 'pass')) {
            setAuditStatus('อนุมัติ');
        } else if (audits.every(audit => audit === 'fail')) {
            setAuditStatus('ไม่อนุมัติ');
        } else {
            setAuditStatus('รอตรวจสอบ');
        }
    };

    useEffect(() => {
        if (id) {
            fetchTeaching(parseInt(id));
            fetchActivity(parseInt(id));
            fetchResearch(parseInt(id));
        }
    }, [id]);

    useEffect(() => {
        const filteredTeaching = teaching.filter(t => 
            (selectedYear ? t.year === selectedYear : true) &&
            (selectedTerm ? t.term === selectedTerm : true)
        );
        updateAuditStatus(filteredTeaching);
    }, [selectedYear, selectedTerm, teaching]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="mt-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            </div>
        );
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
        const totalMinutes = teaching.reduce((total, session) => {
            const startTime = session.starttime.split(':');
            const endTime = session.endtime.split(':');
            const startMinutes = parseInt(startTime[0]) * 60 + parseInt(startTime[1]);
            const endMinutes = parseInt(endTime[0]) * 60 + parseInt(endTime[1]);
            return total + (endMinutes - startMinutes);
        }, 0);
    
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours} ชั่วโมง ${minutes} นาที`;
    };
    
    const totalTeachingHours = calculateTotalTeachingHours(teaching); 
    
    

    const filteredTeaching = teaching.filter(t => 
        (selectedYear ? t.year === selectedYear : true) &&
        (selectedTerm ? t.term === selectedTerm : true)
    );

    const years = [...new Set(teaching.map(t => t.year))];

    const getAuditStatusClass = (status) => {
        switch(status) {
            case 'อนุมัติ':
                return 'text-green-600 bg-green-100 rounded-md px-2';
            case 'ไม่อนุมัติ':
                return 'text-red-600 bg-red-100 rounded-md px-2';
            case 'รอตรวจสอบ':
                return 'text-blue-600 bg-blue-100 rounded-md px-2';
            default:
                return '';
        }
    };

    return (
        <div className="px-4">
            <div className="flex items-center mb-6">
                <h1 className="text-2xl font-semibold mr-4">กราฟผลงานทั้งหมด</h1>
                <Select
                    placeholder="เลือกปี"
                    onChange={value => setSelectedYear(value)}
                    value={selectedYear}
                    style={{ width: 200 }}
                >
                    {years.map(year => (
                        <Option key={year} value={year}>{year}</Option>
                    ))}
                </Select>
                <Select
                    placeholder="เลือกเทอม"
                    onChange={value => setSelectedTerm(value)}
                    value={selectedTerm}
                    style={{ width: 200, marginLeft: 10 }}
                >
                    <Option value={1}>1</Option>
                    <Option value={2}>2</Option>
                    <Option value={3}>3</Option>
                </Select>
                <div className="flex-grow"></div>
                {auditStatus && <span className={`text-lg font-semibold ${getAuditStatusClass(auditStatus)}`}>{auditStatus}</span>}
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
                                    const session = filteredTeaching.find(s => s.day === day.toLowerCase() && checkTimeOverlap(s.starttime, s.endtime, timeStart, timeEnd));

                                    if (session && !renderedSessions.has(`${day}-${index}`)) {
                                        const colspan = calculateTimeSlots(session.starttime, session.endtime);
                                        for (let i = 0; i < colspan; i++) {
                                            renderedSessions.set(`${day}-${index + i}`, true);
                                        }
                                        return (
                                            <td key={time} colSpan={colspan} title={`เวลาเริ่ม: ${session.starttime}, เวลาจบ: ${session.endtime}`} className="p-2 bg-blue-200 text-center border-x-2 h-10">
                                                {`${session.subjects.nameTH}, ${session.group}`}
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
