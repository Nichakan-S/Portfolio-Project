'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

const FacultyList = () => {
  const [faculty, setFaculty] = useState([])
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    fetchFaculty()
  }, [])

  const fetchFaculty = async () => {
    try {
      const res = await fetch('/api/faculty')
      const data = await res.json()
      setFaculty(data)
    } catch (error) {
      console.error('Failed to fetch faculty', error)
    }
  }

  const filteredFaculty = faculty.filter((faculty) =>
    faculty.facultyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold mb-6">คณะ</h1>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="ค้นหาคณะ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-4 inline-flex items-center px-4 py-2 border rounded-lg shadow-sm text-sm font-medium mr-4"
          />
          <Link
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            href="faculty/create"
          >
            เพิ่มคณะ
          </Link>
        </div>
      </div>
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full">
          <thead className="bg-gray-50 ">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ชื่อคณะ
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                แก้ไข
              </th>
            </tr>
          </thead>
        </table>
        <div className="max-h-96 overflow-y-auto">
          <table className="min-w-full">
            <tbody className="divide-y divide-gray-200">
              {filteredFaculty.length > 0 ? (
                filteredFaculty.map((faculty) => (
                  <tr key={faculty.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {faculty.facultyName}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap text-sm font-medium">
                      <Link
                        className="text-indigo-600 hover:text-indigo-900"
                        href={`/admin/faculty/${faculty.id}`}
                      >
                        แก้ไข
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
