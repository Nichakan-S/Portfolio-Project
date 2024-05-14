'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Descriptions, Card, Input, Button } from 'antd';
import { EditFilled } from '@ant-design/icons';
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

const SubjectList = () => {
    const [subjects, setSubjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await fetch('/api/subject');
                const data = await res.json();
                setSubjects(data);
            } catch (error) {
                console.error('การเรียกข้อมูลวิชาล้มเหลว', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSubjects();
    }, []);

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">กำลังโหลด...</div>;
    }

    const filteredSubjects = subjects.filter(subject => {
        return subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               DayEnum[subject.day]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               subject.group.toLowerCase().includes(searchTerm.toLowerCase()) ||
               subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
               subject.starttime.toLowerCase().includes(searchTerm.toLowerCase()) ||
               subject.endtime.toLowerCase().includes(searchTerm.toLowerCase()) ||
               subject.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
               subject.year.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold mb-6">วิชา</h1>
                <div className="flex items-center mr-4">
                    <Input
                        className="flex-grow mr-2 p-1 text-base border rounded-xl custom-input"
                        placeholder="ค้นหาวิชา..."
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ borderColor: '#2D427C', fontSize: '14px' }}
                    />
                    <Link href="subject/create">
                        <Button
                            className="text-base w-full p-1 border rounded-xl "
                            style={{
                                backgroundColor: '#2D427C',
                                borderColor: '#2D427C',
                                color: 'white',
                                height: '35px',
                                borderWidth: '2px',
                                fontSize: '18px', 
                                width: '120%'
                            }}
                        >
                            เพิ่มวิชา
                        </Button>
                    </Link>
                </div>
            </div>
            {filteredSubjects.length > 0 ? (
                filteredSubjects.map((subject, index) => (
                    <Card
                        key={subject.id}
                        className="max-w-6xl mx-auto px-4 py-6 shadow-xl small-card"
                        style={{ headerHeight: '38px' }}
                        title={`วิชา ${index + 1}`}
                    >
                        <Descriptions layout="horizontal" size="small" className="small-descriptions">
                            <Descriptions.Item label="ชื่อวิชา">{subject.name}</Descriptions.Item>
                            <Descriptions.Item label="รหัสวิชา">{subject.code}</Descriptions.Item>
                            <Descriptions.Item label="วันสอน">{DayEnum[subject.day]}</Descriptions.Item>
                            <Descriptions.Item label="กลุ่มเรียน">{subject.group}</Descriptions.Item>
                            <Descriptions.Item label="เวลาเริ่ม">{subject.starttime}</Descriptions.Item>
                            <Descriptions.Item label="เวลาจบ">{subject.endtime}</Descriptions.Item>
                            <Descriptions.Item label="เทอม">{subject.term}</Descriptions.Item>
                            <Descriptions.Item label="ปีการศึกษา">{subject.year}</Descriptions.Item>
                        </Descriptions>
                        <div className="text-right">
                            <Link href={`/admin/subject/${subject.id}`}>
                                <Button
                                    type="link"
                                    icon={<EditFilled style={{ fontSize: '20px', color: '#FFD758' }} />}
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

export default SubjectList;
