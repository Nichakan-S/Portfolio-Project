'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import { SuccessAlert, WarningAlert } from '../../../components/sweetalert';
import { Select , Input , Button , Card , Form } from 'antd';

const CreateMajor = () => {
    const [majorName, setMajorName] = useState('');
    const [faculty, setFaculty] = useState([]);
    const [selectedFaculty, setSelectedFaculty] = useState('');
    const router = useRouter();
    const [componentSize, setComponentSize] = useState('default');


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
        console.log('Selected:', value);
        setSelectedFaculty(value);  // อัพเดทสถานะด้วยค่าที่เลือก
      };    
    
    const facultyOptions = faculty.map(fac => ({
    label: fac.facultyName,
    value: fac.id,
    disabled: fac.disabled
    }));
      

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6" style={{color:"#6C7AA3"}} >เพิ่มสาขาใหม่</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <Card
                    className="max-w-6xl mx-auto px-4 py-8 shadow-xl"
                    >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                            <label htmlFor="facultyName" className="block text-base font-medium mr-4 mb-4">
                                <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> เลือกคณะ : </span>
                            </label>
                            <Select
                                defaultValue="กรุณาเลือกคณะ"
                                className="flex-grow mr-4 mb-4"
                                style={{    
                                    flexBasis: '0%',
                                    flexGrow: 1 ,
                                    width: 'auto', 
                                    borderColor: '#DADEE9', 
                                    fontSize: '16px', 
                                    height: '40px',
                                    minWidth: '300px'        
                                }}
                                onChange={handleChange}
                                options={[{ value: '', label: 'กรุณาเลือกคณะ', disabled: true }, ...facultyOptions]}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%'}}>
                            <label className="block text-base font-medium mr-7 mb-4">
                                <span style={{ color: 'red' }}>*</span> ชื่อสาขา : 
                            </label>
                            <Input 
                                placeholder="ชื่อสาขา"
                                name="majorName"
                                size="large"
                                id="majorName"
                                required
                                value={majorName}
                                onChange={(e) => setMajorName(e.target.value)}
                                className="flex-grow mr-4 mb-4 "
                                showCount 
                                maxLength={250} 
                                style={{ 
                                    flexGrow: 1, 
                                    flexShrink: 1, 
                                    flexBasis: '50%', 
                                    padding: '8px', 
                                    minWidth: '300px' 
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '103%' , padding: '15px' }}>
                            <Button 
                                className="inline-flex justify-center mr-4 mb-4"
                                disabled={!majorName} 
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
                    </div>
                </Card>
            </form>
        </div>
    );
};

export default CreateMajor;
