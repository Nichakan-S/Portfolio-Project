'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button, Input, Flex } from 'antd';

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
    const [teaching, setTeaching] = useState([])
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const { id } = params;

    const fetchteaching = async (id) => {
        try {
            const response = await fetch(`/api/userTeaching/${id}`)
            const data = await response.json()
            console.log('teaching data fetched:', data);
            setTeaching(data)
        } catch (error) {
            console.error('Failed to fetch teaching', error)
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (id) {
            fetchteaching(parseInt(id));
        }
    }, [id]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    const filteredteaching = teaching.filter((teaching) => {
        return teaching.subjects?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teaching.subjects?.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teaching.subjects?.group.toLowerCase().includes(searchTerm.toLowerCase()) ||
            DayEnum[teaching.subjects?.day].includes(searchTerm.toLowerCase()) ||
            teaching.subjects?.starttime.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teaching.subjects?.endtime.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teaching.subjects?.year.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });

    const calculateTimeSlots = (startTime, endTime) => {
        const start = startTime.split(':');
        const end = endTime.split(':');
        const startMinutes = parseInt(start[0]) * 60 + parseInt(start[1]);
        const endMinutes = parseInt(end[0]) * 60 + parseInt(end[1]);
        return Math.ceil((endMinutes - startMinutes) / 60);
    };

    const findStartColumn = (startTime, times) => {
        const start = startTime.split(':');
        const startMinutes = parseInt(start[0]) * 60 + parseInt(start[1]);
        return times.findIndex(time => {
            const [startHour, startMinute] = time.split('-')[0].split(':');
            const startTimeInMinutes = parseInt(startHour) * 60 + parseInt(startMinute);
            return startMinutes >= startTimeInMinutes;
        });
    };

    const checkTimeOverlap = (sessionStart, sessionEnd, slotStart, slotEnd) => {
        const sessionStartMin = parseInt(sessionStart.split(':')[0]) * 60 + parseInt(sessionStart.split(':')[1]);
        const sessionEndMin = parseInt(sessionEnd.split(':')[0]) * 60 + parseInt(sessionEnd.split(':')[1]);
        const slotStartMin = parseInt(slotStart.split(':')[0]) * 60;
        const slotEndMin = parseInt(slotEnd.split(':')[0]) * 60;

        return sessionStartMin < slotEndMin && sessionEndMin > slotStartMin;
    };

    const renderedSessions = new Map();

    const times = ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00', '19:00-20:00', '20:00-21:00'];
    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="container mx-auto px-4">
                <table className="table-auto">
                    <thead className="border-2 border-gray-300">
                        <tr>
                            <th className="p-2 bg-gray-200">Day/Time</th>
                            {times.map(time => (
                                <th key={time} className="p-2 bg-gray-200 ">{time}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="border-2">
                        {days.map(day => (
                            <tr key={day}>
                                <td className="p-2 uppercase border-2 border-gray-300">{DayEnum[day]}</td>
                                {times.map((time, index) => {
                                    const timeRange = time.split('-');
                                    const timeStart = timeRange[0];
                                    const timeEnd = timeRange[1];
                                    const session = teaching.find(s => s.subjects.day === day.toLowerCase() && checkTimeOverlap(s.subjects.starttime, s.subjects.endtime, timeStart, timeEnd));

                                    if (session && !renderedSessions.has(`${day}-${index}`)) {
                                        const colspan = calculateTimeSlots(session.subjects.starttime, session.subjects.endtime);
                                        for (let i = 0; i < colspan; i++) {
                                            renderedSessions.set(`${day}-${index + i}`, true);
                                        }
                                        return (
                                            <td key={time} colSpan={colspan} className="p-2 bg-blue-200 border-2 border-gray-300">
                                                {`${session.subjects.name}, ${session.subjects.group} (${session.subjects.starttime}-${session.subjects.endtime})`}
                                            </td>
                                        );
                                    }
                                    return !renderedSessions.has(`${day}-${index}`) ? <td key={time} className="p-2 border-y-2 border-gray-300"></td> : null;
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
        </div>
    )
}

export default TeachingList
