'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Descriptions, Card, Input, Button, Select } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import '/src/app/globals.css';
import SearchInput from '/src/app/components/SearchInputAll.jsx';


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
    const [year, setYear] = useState('all');
    const [term, setTerm] = useState('all');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTeachings = async () => {
            try {
                const res = await fetch('/api/teaching');
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

    const uniqueYears = [...new Set(teachings.map(teaching => teaching.year.toString()))];

    const filteredTeachings = teachings.filter(teaching => {
        const matchesYear = year === 'all' || teaching.year.toString() === year;
        const matchesTerm = term === 'all' || teaching.term.toString() === term;
        const searchTermLower = searchTerm.toLowerCase();

        return matchesYear && matchesTerm && (
            teaching.subjects?.nameTH.toLowerCase().includes(searchTermLower) ||
            teaching.subjects?.code.toLowerCase().includes(searchTermLower) ||
            teaching.group.toLowerCase().includes(searchTermLower) ||
            DayEnum[teaching.day]?.toLowerCase().includes(searchTermLower) ||
            teaching.starttime.toLowerCase().includes(searchTermLower) ||
            teaching.endtime.toLowerCase().includes(searchTermLower) ||
            `${teaching.user?.prefix} ${teaching.user?.username} ${teaching.user?.lastname}`.toLowerCase().includes(searchTermLower)
        );
    });

    return (
        <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold mb-6" style={{ color: '#2D427C' }} >บันทึกการสอน</h1>
                <div className="flex items-center mr-4">
                    <SearchInput
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="ค้นหาบันทึกการสอน..."
                        />
                    <Select
                        placeholder="เลือกปี"
                        value={year}
                        onChange={value => setYear(value)}
                        className="select-custom flex-grow mr-2 w-48"
                        style={{
                            borderColor: '#4b70af',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <Select.Option value="all">ทั้งหมด</Select.Option>
                        {uniqueYears.map(year => (
                            <Select.Option key={year} value={year}>{year}</Select.Option>
                        ))}
                    </Select>
                    <Select
                        placeholder="เลือกเทอม"
                        value={term}
                        onChange={value => setTerm(value)}
                        className="select-custom flex-grow w-48"
                        style={{
                            borderColor: '#4b70af',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <Select.Option value="all">ทั้งหมด</Select.Option>
                        <Select.Option value="1">เทอม 1</Select.Option>
                        <Select.Option value="2">เทอม 2</Select.Option>
                        <Select.Option value="3">เทอม 3</Select.Option>
                    </Select>
                    <style jsx>{`
                        .select-custom .ant-select-selector {
                            border-radius: 10px !important;
                            border-color: #4b70af !important;
                        }
                        .select-custom .ant-select-arrow {
                            color: #4b70af;
                        }
                    `}</style>
                </div>
            </div>
            <div style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                {filteredTeachings.length > 0 ? (
                    filteredTeachings.map((teaching, index) => (
                        <Card
                            key={teaching.id}
                            className="max-w-6xl mx-auto px-4 py-6 shadow-xl small-card"
                            style={{ headerHeight: '38px' }}
                            title={`ผู้สอน ${teaching.user?.prefix} ${teaching.user?.username} ${teaching.user?.lastname}`}
                        >
                            <Descriptions layout="horizontal" size="small" className="small-descriptions">
                                <Descriptions.Item label="ชื่อวิชา">{teaching.subjects?.nameTH}</Descriptions.Item>
                                <Descriptions.Item label="รหัสวิชา">{teaching.subjects?.code}</Descriptions.Item>
                                <Descriptions.Item label="วันที่สอน">{DayEnum[teaching.day]}</Descriptions.Item>
                                <Descriptions.Item label="กลุ่มเรียน">{teaching.group}</Descriptions.Item>
                                <Descriptions.Item label="เวลาเริ่ม">{teaching.starttime}</Descriptions.Item>
                                <Descriptions.Item label="เวลาจบ">{teaching.endtime}</Descriptions.Item>
                                <Descriptions.Item label="ปี">{teaching.year}</Descriptions.Item>
                                <Descriptions.Item label="เทอม">{teaching.term}</Descriptions.Item>
                            </Descriptions>
                            <div className="text-right">
                                <Link href={`/admin/teaching/${teaching.id}`}>
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

export default TeachingList;
