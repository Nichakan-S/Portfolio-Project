'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Descriptions, Card, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import '/src/app/globals.css'
import SearchInput from '/src/app/components/SearchInput';


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
                <h1 className="text-3xl font-bold mb-6" style={{ color: "#2D427C" }}>วิชา</h1>
                <SearchInput
                    value={searchTerm}
                    onChange={(value) => setSearchTerm(value)}
                    placeholder="ค้นหาวิชา..."
                />
            </div>
            <div style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                {filteredSubjects.length > 0 ? (
                    filteredSubjects.map((subject) => (
                        <Card
                            key={subject.id}
                            className="max-w-6xl mx-auto px-4 py-6 shadow-xl small-card"
                        >
                            <Descriptions layout="horizontal" size="small" className="small-descriptions" column={2}>
                                <Descriptions.Item label="ชื่อวิชาไทย">
                                    {subject.nameTH}
                                </Descriptions.Item>
                                <Descriptions.Item label="ชื่อวิชาอังกฤษ">
                                    {subject.nameEN}
                                </Descriptions.Item>
                                <Descriptions.Item label="รหัสวิชา">
                                    {subject.code}
                                </Descriptions.Item>
                                <Descriptions.Item label="สาขา" >
                                    {subject.major.majorName}
                                </Descriptions.Item>

                            </Descriptions>
                            <div className="text-right">
                                <Link href={`/admin/subjectEdit/${subject.id}`} className="text-right">
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
        </div>
    );
};

export default SubjectList;
