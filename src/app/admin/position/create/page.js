'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'
import { SuccessAlert, WarningAlert } from '../../../components/sweetalert';
import { Input, Select, Card, Button } from 'antd';

const CreatePosition = () => {
    const [name, setName] = useState('');
    const [auditAccess, setAuditAccess] = useState('disable');
    const [employeeAccess, setEmployeeAccess] = useState('disable');
    const [activityAccess, setActivityAccess] = useState('disable');
    const [researchAccess, setResearchAccess] = useState('disable');
    const [overviewAccess, setOverviewAccess] = useState('disable');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const auditBool = auditAccess === 'enable';
        const employeeBool = employeeAccess === 'enable';
        const activityBool = activityAccess === 'enable';
        const researchBool = researchAccess === 'enable';
        const overviewBool = overviewAccess === 'enable';
        try {
            const response = await fetch('/api/position', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    audit: auditBool,
                    employee: employeeBool,
                    approveResearch: researchBool,
                    approveActivity: activityBool,
                    overview: overviewBool
                })
            });

            if (!response.ok) throw new Error('Something went wrong');

            SuccessAlert('สำเร็จ!', 'ข้อมูลได้ถูกบันทึกแล้ว');
            router.push('/admin/position');

        } catch (error) {
            console.error(error);
            WarningAlert('ผิดพลาด!', 'ไม่สามารถบันทึกข้อมูลได้');
        }
    };
    
    const handleBack = () => {
        router.push('/admin/position');
    };

    const AudithandleChange = (value) => {
        setAuditAccess(value);
    };

    const EmployeehandleChange = (value) => {
        setEmployeeAccess(value);
    };

    const ActivityhandleChange = (value) => {
        setActivityAccess(value);
    };

    const ResearchhandleChange = (value) => {
        setResearchAccess(value);
    };

    const OverviewhandleChange = (value) => {
        setOverviewAccess(value);
    };

    return (
        <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-2xl font-semibold mb-6">เพิ่มตำแหน่งใหม่</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="max-w-6xl mx-auto px-4 py-8 shadow-xl" >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <label htmlFor="name" className="block mr-4 mb-4">
                                    <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span>ชื่อตำแหน่ง : </span>
                                </label>
                            </div>
                            <Input
                                type="text"
                                name="name"
                                id="name"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="flex-grow mr-4"
                                showCount
                                maxLength={50}
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
                            <label htmlFor="auditAccess" className="block mr-4 mb-4">
                                <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}> *</span> ตรวจสอบผลงาน : </span>
                            </label>
                            <Select
                                id="auditAccess"
                                value={auditAccess}
                                onChange={AudithandleChange}
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
                            <label htmlFor="employeeAccess" className="block mr-4 mb-4">
                                <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}> *</span> สำรวจบุคลากร : </span>
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
                            <label htmlFor="activityAccess" className="block mr-4 mb-4">
                                <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> อนุมัติผลงานกิจกรรม : </span>
                            </label>
                            <Select
                                id="activityAccess"
                                value={activityAccess}
                                onChange={ActivityhandleChange}
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
                            <label htmlFor="researchAccess" className="block mr-4 mb-4">
                                <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> อนุมัติผลงานวิจัย : </span>
                            </label>
                            <Select
                                id="researchAccess"
                                value={researchAccess}
                                onChange={ResearchhandleChange}
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
                                <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> กราฟแสดงผลงาน : </span>
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
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%', padding: '8px 0' }} >
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

export default CreatePosition;
