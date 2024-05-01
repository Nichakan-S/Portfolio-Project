'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SuccessAlert, WarningAlert, ConfirmAlert } from '../../../components/sweetalert';
import { Input , Button} from 'antd';



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
      <h1 className="text-2xl font-semibold mb-6">แก้ไขชื่อคณะ {facultyName}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="facultyName"
            className="block text-base font-medium text-gray-700 mb-3"
          >
            ชื่อคณะที่ต้องการเปลี่ยนใหม่
          </label>
          <Input 
            placeholder="facultyName" 
            size="large"
            type="text"
            name="facultyName"
            id="facultyName"
            required
            value={facultyName}
            onChange={(e) => setFacultyName(e.target.value)}
            />
          </div>
        <div className="flex items-center">
          <Button className="inline-flex justify-center mr-4"
            type="primary"
            size="middle"
            onClick={handleSubmit}
            style={{ backgroundColor: '#00B96B', borderColor: '#00B96B' }}
            >
            บันทึก
          </Button>
          <Button className="inline-flex justify-center mr-4"
            type="primary" danger
            size="middle"
            onClick={handleDelete}
            >
            ลบ
          </Button>
          <Button className="inline-flex justify-center mr-4"
              onClick={handleBack}
              >
              ยกเลิก
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditFaculty;
