'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Card, Descriptions, Empty, Tag } from 'antd';
import SearchInput from '/src/app/components/SearchInputAll.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

const ResearchType = {
    journalism: 'ผ่านสื่อ',
    researchreports: 'เล่มตีพิมพ์',
    posterpresent: 'โปสเตอร์'
};

const Status = {
    wait: 'รอ',
    pass: 'ผ่าน',
    fail: 'ไม่ผ่าน'
};

const ResearchList = () => {
    const [research, setResearch] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchResearch = async () => {
            try {
                const res = await fetch('/api/research');
                const data = await res.json();
                console.log('Research data fetched:', data);
                setResearch(data);
            } catch (error) {
                console.error('Failed to fetch research:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchResearch();
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

    const statusTag = (value) => (
        <Tag color={value ? 'green' : 'volcano'}>{value ? 'ผ่าน' : 'ไม่ผ่าน'}</Tag>
    );

    const filteredResearch = research.filter((item) =>
        item.nameTH.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.researchFund.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.year.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        Status[item.audit].toLowerCase().includes(searchTerm.toLowerCase()) ||
        Status[item.approve].toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold" style={{ color: '#2D427C' }}>ผลงานวิจัย</h1>
                <SearchInput
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // ตอนนี้ e คือ event ทั้งหมดที่มาจาก SearchInput
                placeholder="ค้นหาผลงานวิจัย..."
                />

            </div>
            {filteredResearch.length > 0 ? (
                filteredResearch.map((item, index) => (
                    <Card key={item.id} 
                        className="max-w-6xl mx-auto px-4 py-6 shadow-xl small-card"
                        style={{ headerHeight: '38px' }}>
                        <Descriptions title={`${index + 1}. ${item.nameTH}`} layout="horizontal"size="small" className="small-descriptions">
                            <Descriptions.Item label="ชื่องานวิจัย">{item.nameTH}</Descriptions.Item>
                            <Descriptions.Item label="ทุนวิจัย">{item.researchFund}</Descriptions.Item>
                            <Descriptions.Item label="ประเภท">{ResearchType[item.type]}</Descriptions.Item>
                            <Descriptions.Item label="ปีที่ตีพิมพ์">{item.year}</Descriptions.Item>
                            <Descriptions.Item label="ตรวจสอบ">{statusTag(item.audit)}</Descriptions.Item>
                            <Descriptions.Item label="อนุมัติ">{statusTag(item.approve)}</Descriptions.Item>
                        </Descriptions>
                        <div className="text-right">
                            <Link href={`/admin/research/${item.id}`}>
                                <Button type="link" icon={<FontAwesomeIcon icon={faPen} style={{ color: '#FFD758' }} />}>
                                    แก้ไข
                                </Button>
                            </Link>
                        </div>
                    </Card>
                ))
            ) : (
                <Empty description="ไม่มีข้อมูลผลงานวิจัย" />
            )}
        </div>
    );
};

export default ResearchList;
