'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button, Input, Flex } from 'antd';
import { EditFilled } from '@ant-design/icons';

const FacultyList = () => {
  const [faculty, setFaculty] = useState([])
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFaculty()
  }, [])

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
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const filteredFaculty = faculty.filter((faculty) =>
    faculty.facultyName.toLowerCase().includes(searchTerm.toLowerCase())
  );



  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold mb-6">คณะ</h1>
        <div className="flex items-center justify-between">
          <Input 
            className="flex-grow mr-2 p-2 text-base border rounded-lg"
            placeholder="ค้นหาคณะ..." 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ color: '#929DB8 !important' }}
          />
          <Flex align="flex-start" gap="small" vertical  >
            <Link href="faculty/create">
              <Button 
                className="text-base mr-4 w-full p-2 border rounded-lg "
                style={{
                  backgroundColor: 'transparent', 
                  borderColor: '#2D427C', 
                  color: '#2D427C',
                  height: '40px'
                }}
                >
                  เพิ่มคณะ
              </Button>
            </Link>
          </Flex>
        </div>
      </div>
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg ">
        <table className="min-w-full">
          <thead className="text-base rounded-lg"
                  style={{

                  }}  >
            <tr>
              <th scope="col" className="w-1 px-6 text-left text-base font-medium uppercase tracking-wider" style={{ paddingTop: '12px', paddingBottom: '12px' , color: '#000000' }}>#</th>
              <th scope="col" className="px-9 text-left text-base font-medium uppercase tracking-wider" style={{ paddingTop: '12px', paddingBottom: '12px' , color: '#000000' }}>ชื่อคณะ</th>
              <th scope="col" className="px-6 text-right text-base font-medium uppercase tracking-wider" style={{ paddingTop: '12px', paddingBottom: '12px' , color: '#000000' }}>แก้ไข</th>
            </tr>
          </thead>
        </table>
        <div className="max-h-96 overflow-y-auto">
          <table className="min-w-full">
            <tbody className="divide-y divide-gray-200">
              {filteredFaculty.length > 0 ? (
                filteredFaculty.map((faculty, index) => (
                  <tr key={faculty.id}>
                    <td className="w-1 px-6  whitespace-nowrap" style={{ paddingTop: '8px', paddingBottom: '8px' }}>
                      {index + 1}
                    </td>
                    <td className="px-6  whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900" style={{ paddingTop: '8px', paddingBottom: '8px' }}>
                        {faculty.facultyName}
                      </div>
                    </td>
                    <td className="px-6  whitespace-nowrap text-right" style={{ paddingTop: '8px', paddingBottom: '8px' }}>
                      <Link href={`/admin/faculty/${faculty.id}`}>
                        <Button 
                          type="link" 
                          icon={<EditFilled style={{ fontSize: '20px' }}/>}
                          style={{ color: '#FFD758' }}
                        />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    ไม่มีข้อมูล
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default FacultyList
