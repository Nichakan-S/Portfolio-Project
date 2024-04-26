'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SuccessAlert, WarningAlert, ConfirmAlert } from '../../../components/sweetalert';


const EditFaculty = ({ params }) => {
  const [facultyName, setFacultyName] = useState('');
  const router = useRouter();
  const { id } = params;
  const [isLoading, setIsLoading] = useState(true);

  const fetchFaculty = async (id) => {
    try {
      const response = await fetch(`/api/faculty/${id}`);
      const data = await response.json();
      if (!response.ok) throw new Error('Failed to fetch Faculty');
      setFacultyName(data.facultyName);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchFaculty(parseInt(id));
    }
    if (facultyName) {
      fetchFaculty(parseInt(facultyName));
    }
  }, [id], [facultyName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/faculty/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ facultyName }),
      });

      if (!response.ok) throw new Error('Failed to update Faculty');

      SuccessAlert('สำเร็จ!', 'ข้อมูลถูกอัปเดตเรียบร้อยแล้ว');
      router.push('/admin/faculty');
    } catch (error) {
      console.error(error);
      WarningAlert('ผิดพลาด!', 'ไม่สามารถบันทึกข้อมูลได้');
    }
  };

  const handleDelete = async () => {
    ConfirmAlert('คุณแน่ใจที่จะลบข้อมูลนี้?', 'การดำเนินการนี้ไม่สามารถย้อนกลับได้', async () => {
      try {
        const response = await fetch(`/api/faculty/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete the faculty.');
        SuccessAlert('ลบสำเร็จ!', 'ข้อมูลถูกลบแล้ว');
        router.push('/admin/faculty');
      } catch (error) {
        console.error('Failed to delete the faculty', error);
        WarningAlert('ผิดพลาด!', 'ไม่สามารถลบข้อมูลได้');
      }
    });
  };
  const handleBack = () => {
    router.push('/admin/faculty');
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">แก้ไขชื่อคณะ{facultyName}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="facultyName"
            className="block text-sm font-medium text-gray-700"
          >
            ชื่อคณะ
          </label>
          <input
            type="text"
            name="facultyName"
            id="facultyName"
            required
            value={facultyName}
            onChange={(e) => setFacultyName(e.target.value)}
            className="p-2 mt-1 block w-full h-12 rounded-lg border-gray-300 shadow-lg focus:border-indigo-500 focus:ring-indigo-500 text-lg"
          />
        </div>
        <div className="flex items-center">
          <button
            type="submit"
            className="mr-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            บันทึก
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="mr-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            ลบ
          </button>
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            ยกเลิก
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditFaculty;
