'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import { SuccessAlert, WarningAlert } from '../../../components/sweetalert';
import { Select , Input , Button} from 'antd';

const CreateMajor = () => {
    const [majorName, setMajorName] = useState('');
    const [faculty, setFaculty] = useState([]);
    const [selectedFaculty, setSelectedFaculty] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchfaculty = async () => {
            const response = await fetch('/api/faculty');
            const data = await response.json();
            setFaculty(data);
        };

        fetchfaculty();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFaculty) {
            WarningAlert('ผิดพลาด!', 'กรุณาเลือกคณะ');
            return;
        }
        try {
            const response = await fetch('/api/major', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ facultyId: selectedFaculty, majorName })
            });

            if (!response.ok) throw new Error('Something went wrong');

            SuccessAlert('สำเร็จ!', 'ข้อมูลได้ถูกบันทึกแล้ว');
            router.push('/admin/major');

        } catch (error) {
            console.error(error);
            WarningAlert('ผิดพลาด!', 'ไม่สามารถบันทึกข้อมูลได้');
        }
    };

    const handleBack = () => {
        router.push('/admin/major');
    };

    const handleChange = (value) => {
        setSelectedFaculty(value);
        console.log(`selected ${value}`);
      };      
    
    const facultyOptions = faculty.map(fac => ({
    label: fac.facultyName,
    value: fac.id,
    disabled: fac.disabled
    }));
      

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">เพิ่มสาขาใหม่</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="faculty" className="block text-base font-medium text-gray-700 mr-2 mb-4">
                        เลือกคณะ
                    </label>
                    <Select
                        defaultValue="กรุณาเลือกคณะ"
                        style={{ width: '100%' }}
                        size="large"
                        onChange={handleChange}
                        options={[{ value: '', label: 'กรุณาเลือกคณะ', disabled: true }, ...facultyOptions]}
                    />

                    <label htmlFor="majorName" className="block text-base font-medium text-gray-700 mt-4 mb-4">
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
                        onClick={handleBack}
                        >
                        ยกเลิก
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateMajor;
