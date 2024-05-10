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
                    <div labelCol={{ span: 4 }}
                        wrapperCol={{ span: 14 }}
                        layout="horizontal"
                        initialValues={{ size: componentSize }}
                        size={componentSize}
                        style={{ maxWidth: 600 }}>
                        <Form.Item 
                            label={<span style={{ fontSize: '16px' }}>เลือกคณะ</span>} 
                            className="block text-base font-medium text-gray-700 mr-4 mb-4">
                            <Select
                                defaultValue="กรุณาเลือกคณะ"
                                size="large"
                                style={{ width: '500px' , borderColor: '#DADEE9' , fontSize: '16px' , height: '40px'}}
                                onChange={handleChange}
                                options={[{ value: '', label: 'กรุณาเลือกคณะ', disabled: true }, ...facultyOptions]}
                                className=" flex-grow rounded-md  mb-4 "
                                
                            />
                        </Form.Item>
                        <Form.Item 
                            label={<span style={{ fontSize: '16px' }}>ชื่อสาขา</span>} 
                            className="block text-base font-medium text-gray-700 mt-4 mb-4" > 
                            <Input 
                                placeholder="majorName" 
                                type="text"
                                name="majorName"
                                size="large"
                                id="majorName"
                                required
                                value={majorName}
                                onChange={(e) => setMajorName(e.target.value)}
                                className=" flex-grow mr-2 p-1 text-base border rounded-md custom-input mb-4 "
                                style={{ borderColor: '#DADEE9' , fontSize: '14px' , height: '40px', width: '500px'}}
                            />
                        </Form.Item>

                    <Button 
                        className="inline-flex text-base justify-center mr-4 mb-4 mr-2 p-1"
                        type="primary"
                        size="middle"
                        onClick={handleSubmit}
                        style={{ 
                            backgroundColor: '#00B96B', 
                            height: '35px',
                            borderColor: '#00B96B' ,
                            fontSize: '18px' ,
                            width: '70px'}}
                        >
                        บันทึก
                    </Button>
                    <Button 
                        className="inline-flex text-base justify-center mr-4 mb-4 mr-2 p-1"
                        size="middle"
                        onClick={handleBack}
                        style={{ 
                            height: '35px',
                            fontSize: '18px' ,
                            width: '70px' }}
                        >
                        ยกเลิก
                    </Button>
                    </div>
                </Card>
            </form>
        </div>
    );
};

export default CreateMajor;
