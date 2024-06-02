'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Card, Descriptions, Empty , Tag} from 'antd';
import SearchInput from '/src/app/components/SearchInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

const PositionList = () => {
  const [position, setPosition] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPosition();
  }, []);

  const fetchPosition = async () => {
    try {
      const res = await fetch('/api/position');
      const data = await res.json();
      console.log('Position data fetched:', data);
      setPosition(data);
    } catch (error) {
      console.error('Failed to fetch position:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="mt-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  const booleanText = (value) => (
    <Tag color={value ? 'green' : 'volcano'} style={{ fontSize:'14px'}}>{value ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}</Tag>
  );

  const filteredPosition = position.filter((pos) =>
    pos.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold" style={{ color: '#2D427C' }}>ตำแหน่ง</h1>
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="ค้นหาตำแหน่ง..."
        />
        <Link href="position/create">
          <Button type="primary" style={{ backgroundColor: '#2D427C', borderColor: '#2D427C' }}>
            เพิ่มตำแหน่ง
          </Button>
        </Link>
      </div>
      {filteredPosition.length > 0 ? (
        filteredPosition.map((pos, index) => (
          <Card key={pos.id} 
          className="max-w-6xl mx-auto px-4 py-6 shadow-xl small-card"
          style={{ headerHeight: '38px' }}>
            <Descriptions title={`${index + 1}. ${pos.name}`} layout="horizontal" size="small" className="small-descriptions">
              <Descriptions.Item label="ตรวจสอบ">{booleanText(pos.audit)}</Descriptions.Item>
              <Descriptions.Item label="สำรวจบุคลากร">{booleanText(pos.employee)}</Descriptions.Item>
              <Descriptions.Item label="อนุมัติกิจกรรม">{booleanText(pos.approveActivity)}</Descriptions.Item>
              <Descriptions.Item label="อนุมัติวิจัย">{booleanText(pos.approveResearch)}</Descriptions.Item>
              <Descriptions.Item label="กราฟผลงาน">{booleanText(pos.overview)}</Descriptions.Item> 
            </Descriptions>
            <div className="text-right">
                <Link
                    href={`/admin/position/${position.id}`} style={{ color: '#FFD700'}} >
                        แก้ไข
                    <Button
                        type="link"
                        icon={<FontAwesomeIcon icon={faPen} style={{ fontSize: '16px', color: '#FFD758' }} />}
                    />
                </Link>
            </div>
            
          </Card>
        ))
      ) : (
        <Empty description="ไม่มีข้อมูล" />
      )}
    </div>
  );
};

export default PositionList;
