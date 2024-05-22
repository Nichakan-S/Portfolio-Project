'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button, Input, Flex, Empty } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen , faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import SearchInput from '/src/app/components/SearchInput';

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
    return (
      <div className="flex justify-center items-center h-full">
        <div className="mt-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  const filteredFaculty = faculty.filter((faculty) =>
    faculty.facultyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl" style={{ color: "#6C7AA3" }}>คณะ</h1>
          <SearchInput
            value={searchTerm}
            onChange={(value) => setSearchTerm(value)}
            placeholder="ค้นหาคณะ..."
          />
          <Link href="faculty/create">
            <Button
              className="text-base p-1 border rounded-xl"
              style={{
                backgroundColor: '#2D427C',
                borderColor: '#2D427C',
                color: 'white',
                height: '35px',
                borderWidth: '2px',
                fontSize: '18px'
              }}
            >
              เพิ่มคณะ
            </Button>
          </Link>
        </div>
      </div>
      <div className="shadow-xl overflow-hidden border-b border-gray-200 sm:rounded-lg ">
        <table className="min-w-full">
          <thead className="text-base rounded-lg border-b "
            style={{
              color: '#000000',
              borderColor: '#2D427C',
            }}  >
            <tr>
              <th scope="col"
                className="w-1 px-6 text-left  uppercase tracking-wider"
                style={{ paddingTop: '12px', paddingBottom: '12px', fontSize: '18px' }}
              >#</th>
              <th scope="col"
                className="px-5 text-left  uppercase tracking-wider"
                style={{ paddingTop: '12px', paddingBottom: '12px', fontSize: '18px' }}
              >ชื่อคณะ</th>
              <th scope="col"
                className="px-6 text-right  uppercase tracking-wider"
                style={{ paddingTop: '12px', paddingBottom: '12px', fontSize: '18px' }}
              >แก้ไข</th>
            </tr>
          </thead>
        </table>
        <div className="max-h-96 overflow-y-auto">
          <table className="min-w-full">
            <tbody className="divide-y divide-gray-200 " style={{ borderColor: '#2D427C' }}>
              {filteredFaculty.length > 0 ? (
                filteredFaculty.map((faculty, index) => (
                  <tr key={faculty.id} >
                    <td className="w-1 px-6  whitespace-nowrap" style={{ paddingTop: '9px', paddingBottom: '9px', fontSize: '16px' }}>
                      {index + 1}
                    </td>
                    <td className="px-6  whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900" style={{ paddingTop: '9px', paddingBottom: '9px', fontSize: '16px' }}>
                        {faculty.facultyName}
                      </div>
                    </td>
                    <td className="px-6 whitespace-nowrap text-right" style={{ paddingTop: '9px', paddingBottom: '9px', fontSize: '16px' }}>
                      <Link href={`/admin/faculty/${faculty.id}`}>
                        <Button
                          type="link"
                          icon={<FontAwesomeIcon icon={faPen} style={{ fontSize: '16px', color: '#FFD758' }} />}
                        />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <Empty />
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