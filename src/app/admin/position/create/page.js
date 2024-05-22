'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'
import { SuccessAlert, WarningAlert } from '../../../components/sweetalert';
import { Input , Select , Card , Button} from 'antd';

const CreateRank = () => {
    const [rankname, setRankName] = useState('');
    const [employeeAccess, setEmployeeAccess] = useState('disable');
    const [evaluationAccess, setEvaluationAccess] = useState('disable');
    const [overviewAccess, setOverviewAccess] = useState('disable');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const employeeBool = employeeAccess === 'enable';
        const evaluationBool = evaluationAccess === 'enable';
        const overviewBool = overviewAccess === 'enable';
        try {
            const response = await fetch('/api/rank', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rankname,
                    employee: employeeBool,
                    evaluation: evaluationBool,
                    overview: overviewBool })
            });

            if (!response.ok) throw new Error('Something went wrong');

            SuccessAlert('สำเร็จ!', 'ข้อมูลได้ถูกบันทึกแล้ว');
            router.push('/admin/rank');

        } catch (error) {
            console.error(error);
            WarningAlert('ผิดพลาด!', 'ไม่สามารถบันทึกข้อมูลได้');
        }
    };
    const handleBack = () => {
        router.push('/admin/rank');
    };

    const EmployeehandleChange = (value) => {
        setEmployeeAccess(value);
    };

    const OverviewhandleChange = (value) => {
        setOverviewAccess(value);
    };

    const EvaluationhandleChange = (value) => {
        setEvaluationAccess(value);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">เพิ่มตำแหน่งใหม่</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="max-w-6xl mx-auto px-4 py-8 shadow-xl" >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <label htmlFor="rankname" className="block mr-4 mb-4">
                                    <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span>ชื่อตำแหน่ง : </span>
                                </label>
                            </div>
                            <Input
                                type="text"
                                name="rankname"
                                id="rankname"
                                required
                                value={rankname}
                                onChange={(e) => setRankName(e.target.value)}
                                className="flex-grow mr-4"
                                showCount
                                maxLength={100}
                                style={{
                                    flexGrow: 1,
                                    flexShrink: 1,
                                    flexBasis: '50%',
                                    minWidth: '300px',
                                    fontSize: '16px',
                                    height: '40px'
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <label htmlFor="employeeAccess" className="block mr-4 mb-4">
                                <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}> *</span> เข้าถึงหน้าสำรวจบุคคลากร : </span>
                            </label>
                            <Select
                                id="employeeAccess"
                                value={employeeAccess}
                                onChange={EmployeehandleChange}
                                className="flex-grow mr-4 mb-4 custom-select"
                                size='large'
                                style={{
                                    flexBasis: '0%',
                                    flexGrow: 1,
                                    width: '100%',
                                    borderColor: '#DADEE9',
                                    fontSize: '16px',
                                    height: '40px',
                                    minWidth: '300px'
                                }}
                                options={[
                                    { value: 'disable', label: 'ปิดใช้งาน' },
                                    { value: 'enable', label: 'เปิดใช้งาน' }
                                ]}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <label htmlFor="evaluationAccess" className="block mr-4 mb-4">
                                <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> เข้าถึงหน้าประเมินบุคคลากร : </span>
                            </label>
                            <Select
                                id="evaluationAccess"
                                value={evaluationAccess}
                                onChange={EvaluationhandleChange}
                                className="flex-grow mr-4 mb-4 custom-select"
                                size="large"
                                style={{
                                    flexBasis: '0%',
                                    flexGrow: 1,
                                    width: '100%',
                                    borderColor: '#DADEE9',
                                    fontSize: '16px',
                                    height: '40px',
                                    minWidth: '300px'
                                }}
                                options={[
                                    { value: 'disable', label: 'ปิดใช้งาน' },
                                    { value: 'enable', label: 'เปิดใช้งาน' }
                                ]}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <label htmlFor="overviewAccess" className="block mr-4 mb-4">
                                <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> เข้าถึงหน้าภาพรวม : </span>
                            </label>            
                            <Select
                                id="overviewAccess"
                                value={overviewAccess}
                                onChange={OverviewhandleChange}
                                className="flex-grow mr-4 mb-4 custom-select"
                                size="large"
                                style={{
                                    flexBasis: '0%',
                                    flexGrow: 1,
                                    width: '100%',
                                    borderColor: '#DADEE9',
                                    fontSize: '16px',
                                    height: '40px',
                                    minWidth: '300px'
                                }}
                                options={[
                                    { value: 'disable', label: 'ปิดใช้งาน' },
                                    { value: 'enable', label: 'เปิดใช้งาน' }
                                ]}
                            />
                        </div>
                    </div>                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' , padding: '8px 0' }} >
                        <Button className="inline-flex justify-center"
                            type="primary"
                            size="middle"
                            onClick={handleSubmit}
                            style={{ backgroundColor: '#02964F', borderColor: '#02964F', marginRight: '8px' }}
                        >
                            บันทึก
                        </Button>
                        <Button 
                            className="inline-flex justify-center"
                            onClick={handleBack}
                            style={{ marginRight: '15px' }}
                            >
                            ยกเลิก
                        </Button>
                    </div>
                </Card>
            </form>
        </div>
    );
};

export default CreateRank;
