'use client'

import React, { useEffect, useState } from 'react';
import { SuccessAlert, WarningAlert } from '../../../components/sweetalert';
import { Select, Button} from 'antd';

const CreateTeaching = ({ params }) => {
    const { id } = params;
    const [teaching, setTeaching] = useState([]);
    const [selectedSubjects, setSelectedSubjects] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTeaching = async () => {
            const res = await fetch('/api/subject');
            const data = await res.json();
            setTeaching(data);
        };

        const fetchTeachingDetails = async (id) => {
            const res = await fetch(`/api/manageTeaching/${id}`);
            const data = await res.json();
            setSelectedSubjects(data.subjectsId);
            setIsLoading(false);
        };

        fetchTeaching();
        if (id) {
            fetchTeachingDetails(id);
        }
    }, [id]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedSubjects) {
            WarningAlert('ผิดพลาด!', 'กรุณาเลือกวิชาที่สอน');
            return;
        }
        console.log(JSON.stringify({ subjectsId: selectedSubjects}))
        try {
            const response = await fetch(`/api/manageTeaching/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ subjectsId: selectedSubjects})
            });

            if (!response.ok) throw new Error('Something went wrong');

            SuccessAlert('สำเร็จ!', 'ข้อมูลได้ถูกแก้ไขแล้ว');
            window.history.back();
        } catch (error) {
            console.error(error);
            WarningAlert('ผิดพลาด!', 'ไม่สามารถแก้ไขข้อมูลได้');
        }
    };

    const handleBack = () => {
        window.history.back();
    };

    const handleChange = (value) => {
        setSelectedSubjects(value);
        console.log(`selected ${value}`);
    };

    const teachingOptions = teaching.map(fac => ({
        label: fac.name,
        value: fac.id,
        disabled: fac.disabled
    }));

    const handleDelete = async () => {
        ConfirmAlert('คุณแน่ใจที่จะลบข้อมูลนี้?', 'การดำเนินการนี้ไม่สามารถย้อนกลับได้', async () => {
          try {
            const response = await fetch(`/api/manageActivity/${id}`, {
              method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete the manageActivity.');
            SuccessAlert('ลบสำเร็จ!', 'ข้อมูลถูกลบแล้ว');
            window.history.back();
          } catch (error) {
            console.error('Failed to delete the manageActivity', error);
            WarningAlert('ผิดพลาด!', 'ไม่สามารถลบข้อมูลได้');
          }
        });
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
    
    return (
        <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-2xl font-semibold mb-6">เพิ่มวิชาที่สอน</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="teaching" className="block text-base font-medium text-gray-700 mr-2 mb-4">
                        เลือกวิชาที่สอน
                    </label>
                    <Select
                        value={selectedSubjects}
                        defaultValue="กรุณาเลือกวิชาที่สอน"
                        style={{ width: '100%' }}
                        size="large"
                        onChange={handleChange}
                        options={[{ value: '', label: 'กรุณาเลือกวิชาที่สอน', disabled: true }, ...teachingOptions]}
                    />
                </div>
                <div>
                    <Button className="inline-flex justify-center mr-4 "
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

export default CreateTeaching;
