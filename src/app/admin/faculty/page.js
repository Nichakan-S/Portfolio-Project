'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Input, Card, Descriptions, Empty, Skeleton } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import '/src/app/globals.css';

const FacultyList = () => {
    const [faculty, setFaculty] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchFaculty();
    }, []);

    const fetchFaculty = async () => {
        try {
            const res = await fetch('/api/faculty');
            const data = await res.json();
            setFaculty(data);
        } catch (error) {
            console.error('Failed to fetch faculty', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <Skeleton active paragraph={{ rows: 4 }} />
            </div>
        );
    }

    const filteredFaculty = faculty.filter((fac) =>
        fac.facultyName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-semibold" style={{ color: "#6C7AA3" }}>คณะ</h1>
                <div className="flex items-center max-w-6xl mx-auto w-1/2">
                  <Input
                      className="flex-grow mr-2 p-1 text-base max-w-6xl rounded-xl custom-input transition-all duration-300 ease-in-out shadow-sm focus:shadow-outline focus:ring-2 ring-blue-500 w-1/4"
                      placeholder="ค้นหาคณะ..."
                      type="text"
                      value={searchTerm}
                      variant="filled"
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                          fontSize: '14px',
                          width: '100%',
                          maxWidth: 'calc(100% - 100px)',
                          borderWidth: '1px',
                          borderColor: 'rgba(0,0,0,0.2)',
                          outline: 'none',
                          boxShadow: '0 1px 6px rgba(32, 33, 36, 0.28)'
                      }}
                  />
                  <Link href="faculty/create">
                      <Button
                          className="text-base w-full p-1 border rounded-xl shadow-md transition duration-150 ease-in-out hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-opacity-50"
                          style={{
                              backgroundColor: '#2D427C',
                              borderColor: '#2D427C',
                              color: 'white',
                              height: '35px',
                              borderWidth: '2px',
                              fontSize: '16px'
                          }}
                      >
                          เพิ่มคณะ
                      </Button>
                  </Link>
                </div>
            </div>
            {filteredFaculty.length > 0 ? (
                filteredFaculty.map((fac, index) => (
                    <Card
                        key={fac.id}
                        className="shadow-lg mb-4"
                        bordered
                    >
                        <Descriptions size="small" column={1} style={{ width: '100%' }}>
                            <Descriptions.Item label={`คณะที่ ${index + 1}`}>{fac.facultyName}</Descriptions.Item>
                        </Descriptions>
                        <div style={{ textAlign: 'right', marginTop: '-40px' }}>
                            <Link href={`/admin/faculty/${fac.id}`}>
                                <Button type="link" icon={<FontAwesomeIcon icon={faPen} style={{ color: '#FFD758' }} />} />
                            </Link>
                        </div>
                    </Card>
                ))
            ) : (
                <Empty description="ไม่มีข้อมูล" style={{ marginTop: '50px' }} />
            )}
        </div>
    );
};

export default FacultyList;
