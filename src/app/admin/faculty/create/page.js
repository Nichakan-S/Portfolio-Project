'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'
import { SuccessAlert, WarningAlert } from '../../../components/sweetalert';
import { Input , Button , Card } from 'antd';

const CreateFaculty = () => {
    const [facultyName, setFacultyName] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/faculty', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ facultyName })
            });

            if (!response.ok) throw new Error('Something went wrong');

            SuccessAlert('สำเร็จ!', 'ข้อมูลได้ถูกบันทึกแล้ว');
            router.push('/admin/faculty');

        } catch (error) {
            console.error(error);
            WarningAlert('ผิดพลาด!', 'ไม่สามารถบันทึกข้อมูลได้');
        }
    };
    const handleBack = () => {
        router.push('/admin/faculty');
    };

    const onChange = (e) => {
        console.log('Content:', e.target.value);
    };
    

    return (
        <div className="max-w-6xl mx-auto px-4 ">
            <h1 className="text-3xl font-bold mb-6" style={{color:"#2D427C"}} >เพิ่มคณะใหม่</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <Card
                    className="max-w-6xl mx-auto px-4 py-8 shadow-xl"
                    >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <label htmlFor="facultyName" className="block text-base font-medium mr-4 mb-4">
                            <span style={{ color: 'red' }}>*</span> ชื่อคณะ : 
                        </label>
                        <Input 
                            placeholder="ชื่อคณะ" 
                            size="large"
                            name="facultyName"
                            id="facultyName"
                            required
                            value={facultyName}
                            onChange={(e) => setFacultyName(e.target.value)}
                            className="flex-grow mr-8 mb-4 "
                            showCount 
                            maxLength={100} 
                            style={{ 
                                flexGrow: 1, 
                                flexShrink: 1, 
                                flexBasis: '50%', 
                                padding: '8px', 
                                minWidth: '300px' 
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '15px' }} >
                        <Button 
                            className="inline-flex justify-center mr-4 mb-4"
                            disabled={!facultyName} 
                            type="primary"
                            size="middle"
                            onClick={handleSubmit}
                            style={{ 
                                color:'white' , 
                                backgroundColor: '#02964F', 
                                borderColor: '#02964F' ,}}
                            >
                            บันทึก
                        </Button>
                        <Button 
                            className="inline-flex justify-center mr-4 mb-4"
                            onClick={handleBack}
                            size="middle"
                            >
                            ยกเลิก
                        </Button>
                    </div>
                </Card>
            </form>
        </div>
    );
};

export default CreateFaculty;
