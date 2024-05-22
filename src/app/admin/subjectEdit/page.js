'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Descriptions, Card, Input, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import '/src/app/globals.css'


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
        return (
            <div className="flex justify-center items-center h-full">
                <div className="mt-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            </div>
        );
    }

    const filteredSubjects = subjects.filter(subject => {
        return subject.nameTH.toLowerCase().includes(searchTerm.toLowerCase()) ||
               subject.nameEN.toLowerCase().includes(searchTerm.toLowerCase()) ||
               subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
               subject.major.majorName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold mb-6">วิชา</h1>
                <div className="flex items-center space-x-2">
                    <Input
                        className="flex-grow p-1 text-base border rounded-xl custom-input"
                        placeholder="ค้นหาวิชา..."
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ borderColor: '#2D427C', fontSize: '14px' }}
                    />
                </div>
            </div>
            {filteredSubjects.length > 0 ? (
                filteredSubjects.map((subject) => (
                    <Card
                        key={subject.id}
                        className="max-w-6xl mx-auto px-4 py-6 shadow-xl small-card"
                        style={{ headerHeight: '38px' }}
                        title={`วิชา ${subject.nameTH}`}
                    >
                        <Descriptions layout="horizontal" size="small" className="small-descriptions">
                            <Descriptions.Item label="ชื่อวิชาอังกฤษ">{subject.nameEN}</Descriptions.Item>
                            <Descriptions.Item label="รหัสวิชา">{subject.code}</Descriptions.Item>
                            <Descriptions.Item label="สาขา">{subject.major.majorName}</Descriptions.Item>
                        </Descriptions>
                        <div className="text-right">
                            <Link href={`/admin/subjectEdit/${subject.id}`}>
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

export default SubjectList;
