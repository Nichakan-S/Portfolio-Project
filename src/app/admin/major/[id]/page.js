'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SuccessAlert, WarningAlert, ConfirmAlert } from '../../../components/sweetalert';
import { Select , Input , Button , Alert , Space} from 'antd';


const EditMajor = ({ params }) => {
    const [majorName, setMajorName] = useState('');
    const [faculty, setFaculty] = useState([]);
    const [selectedFaculty, setSelectedFaculty] = useState('');
    const router = useRouter();
    const { id } = params;
    const [isLoading, setIsLoading] = useState(true);

    const fetchMajor = async (id) => {
        try {
            const response = await fetch(`/api/major/${id}`);
            const data = await response.json();
            if (!response.ok) throw new Error('Failed to fetch Major');
            setMajorName(data.majorName);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchFacultyAndMajor = async () => {
            try {
                const majorResponse = await fetch(`/api/major/${id}`);
                const majorData = await majorResponse.json();
                if (!majorResponse.ok) throw new Error('Failed to fetch major');
                setMajorName(majorData.majorName);
                setSelectedFaculty(majorData.facultyId);

                const facultyResponse = await fetch('/api/faculty');
                const facultyData = await facultyResponse.json();
                setFaculty(facultyData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchFacultyAndMajor();
    }, [id]);

    useEffect(() => {
        if (id) {
            fetchMajor(parseInt(id));
        }
        if (majorName) {
            fetchMajor(parseInt(majorName));
        }
    }, [id], [majorName]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // แปลง selectedFaculty จาก string เป็น integer
            const facultyIdAsNumber = parseInt(selectedFaculty);
            if (isNaN(facultyIdAsNumber)) {
                throw new Error('Invalid faculty ID');
            }
            const response = await fetch(`/api/major/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    facultyId: facultyIdAsNumber, majorName,
                }),
            });

            if (!response.ok) throw new Error('Failed to update Major');
            SuccessAlert('สำเร็จ!', 'ข้อมูลถูกอัปเดตเรียบร้อยแล้ว');
            router.push('/admin/major');
        } catch (error) {
            console.error(error);
            WarningAlert('ผิดพลาด!', 'ไม่สามารถบันทึกข้อมูลได้');
        }
    };

    const handleDelete = async () => {
        ConfirmAlert('คุณแน่ใจที่จะลบข้อมูลนี้?', 'การดำเนินการนี้ไม่สามารถย้อนกลับได้', async () => {
            try {
                const response = await fetch(`/api/major/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error('Failed to delete the major.');
                // Redirect after successful deletion
                SuccessAlert('ลบสำเร็จ!', 'ข้อมูลถูกลบแล้ว');
                router.push('/admin/major');
            } catch (error) {
                console.error('Failed to delete the major', error);
                WarningAlert('ผิดพลาด!', 'ไม่สามารถลบข้อมูลได้');
            }
        });
    };

    const handleBack = () => {
        router.push('/admin/major');
    };

    const handleChange = (value) => {
        setSelectedFaculty(value); // ตรวจสอบว่าใช้ setSelectedFaculty หรือตัวแปรที่ถูกต้อง
        console.log(`selected ${value}`);
      };      
    
    const facultyOptions = faculty.map(fac => ({
    label: fac.facultyName,
    value: fac.id,
    disabled: fac.disabled // ถ้ามีฟิลด์ disabled ในข้อมูล
    }));

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">แก้ไขชื่อสาขา {majorName}</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="faculty" className="block text-base font-medium text-gray-700 mb-3">
                        เลือกคณะ
                    </label>
                    <Select
                        defaultValue="กรุณาเลือกคณะ"
                        style={{ width: '100%' }}
                        size="large"
                        onChange={handleChange}
                        options={[{ value: '', label: 'กรุณาเลือกคณะ', disabled: true }, ...facultyOptions]}
                    />
                    <label
                        htmlFor="majorName"
                        className="block text-base font-medium text-gray-700 mt-4 mb-4 "
                    >
                        ชื่อสาขา
                    </label>
                    <Input 
                        placeholder="majorName" 
                        size="large"
                        type="text"
                        name="majorName"
                        id="majorName"
                        required
                        value={majorName}
                        onChange={(e) => setMajorName(e.target.value)}
                    />
                    <Space
                        direction="vertical"
                        style={{
                        width: '100%',
                        }}
                        className="mt-4"
                    >
                        <Alert message="กรุณาทราบว่าไม่สามารถลบข้อมูลได้หากมีผู้ใช้งานในสาขาและคณะนี้ โปรดตรวจสอบและยืนยันก่อนกดบันทึกข้อมูล" banner />
                    </Space>
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

export default EditMajor;
