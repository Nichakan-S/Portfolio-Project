'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Descriptions, Card, Input, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import '/src/app/globals.css'

const DayEnum = {
    mon: 'จันทร์',
    tue: 'อังคาร',
    wed: 'พุธ',
    thu: 'พฤหัสบดี',
    fri: 'ศุกร์',
    sat: 'เสาร์',
    sun: 'อาทิตย์',
};

const TeachingList = () => {
    const [teachings, setTeachings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTeachings = async () => {
            try {
                const res = await fetch('/api/manageTeaching/');
                const data = await res.json();
                setTeachings(data);
            } catch (error) {
                console.error('การเรียกข้อมูลการสอนล้มเหลว', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTeachings();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="mt-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            </div>
        );
    }

    const filteredTeachings = teachings.filter(teaching => {
        return teaching.subjects?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               teaching.subjects?.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
               teaching.subjects?.group.toLowerCase().includes(searchTerm.toLowerCase()) ||
               DayEnum[teaching.subjects?.day]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               teaching.subjects?.starttime.toLowerCase().includes(searchTerm.toLowerCase()) ||
               teaching.subjects?.endtime.toLowerCase().includes(searchTerm.toLowerCase()) ||
               teaching.subjects?.year.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold mb-6">วิชาที่สอน</h1>
                <div className="flex items-center mr-4">
                    <Input
                        className="flex-grow mr-2 p-1 text-base border rounded-xl custom-input"
                        placeholder="ค้นหาวิชาที่สอน..."
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ borderColor: '#2D427C', fontSize: '14px' }}
                    />
                </div>
            </div>
            {filteredTeachings.length > 0 ? (
                filteredTeachings.map((teaching, index) => (
                    <Card
                        key={teaching.id}
                        className="max-w-6xl mx-auto px-4 py-6 shadow-xl small-card"
                        style={{ headerHeight: '38px' }}
                        title={`วิชาที่ ${index + 1}`}
                    >
                        <Descriptions layout="horizontal" size="small" className="small-descriptions">
                            <Descriptions.Item label="ชื่อวิชา">{teaching.subjects?.name}</Descriptions.Item>
                            <Descriptions.Item label="รหัสวิชา">{teaching.subjects?.code}</Descriptions.Item>
                            <Descriptions.Item label="วันที่สอน">{DayEnum[teaching.subjects?.day]}</Descriptions.Item>
                            <Descriptions.Item label="กลุ่มเรียน">{teaching.subjects?.group}</Descriptions.Item>
                            <Descriptions.Item label="เวลาเริ่ม">{teaching.subjects?.starttime}</Descriptions.Item>
                            <Descriptions.Item label="เวลาจบ">{teaching.subjects?.endtime}</Descriptions.Item>
                            <Descriptions.Item label="ปี">{teaching.subjects?.year}</Descriptions.Item>
                            <Descriptions.Item label="เทอม">{teaching.subjects?.term}</Descriptions.Item>
                            <Descriptions.Item label="ผู้สอน">{teaching.user?.username}</Descriptions.Item>
                        </Descriptions>
                        <div className="text-right">
                            <Link href={`/users/manage_teaching/edit/${teaching.id}`}>
                                <Button
                                    type="link"
                                    icon={<FontAwesomeIcon icon={faPen} style={{ fontSize: '16px', color: '#FFD758' }} />}
                                />
                            </Link>
                        </div>
                    </Card>
                ))
            ) : (
                <div className="text-center text-sm font-medium">ไม่มีข้อมูล</div>
            )}
        </div>
    );
};

export default TeachingList;
