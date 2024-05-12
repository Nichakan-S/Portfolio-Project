'use client'

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { SuccessAlert, WarningAlert } from '../../../components/sweetalert';
import { Select, Button} from 'antd';

const CreateTeaching = () => {
    const { data: session } = useSession();
    const [teaching, setteaching] = useState([]);
    const [selectedSubjects, setSelectedSubjects] = useState('');

    useEffect(() => {
        const fetchteaching = async () => {
            const response = await fetch('/api/subject');
            const data = await response.json();
            setteaching(data);
        };

        fetchteaching();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedSubjects) {
            WarningAlert('ผิดพลาด!', 'กรุณาเลือกวิชาที่สอน');
            return;
        }
        console.log(JSON.stringify({ subjectsId: selectedSubjects, userId: session.user.id }))
        try {
            const response = await fetch('/api/manageTeaching', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ subjectsId: selectedSubjects, userId: session.user.id })
            });

            if (!response.ok) throw new Error('Something went wrong');

            SuccessAlert('สำเร็จ!', 'ข้อมูลได้ถูกบันทึกแล้ว');
            window.history.back();
        } catch (error) {
            console.error(error);
            WarningAlert('ผิดพลาด!', 'ไม่สามารถบันทึกข้อมูลได้');
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


    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">เพิ่มวิชาที่สอน</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="teaching" className="block text-base font-medium text-gray-700 mr-2 mb-4">
                        เลือกวิชาที่สอน
                    </label>
                    <Select
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
