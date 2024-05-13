'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SuccessAlert, WarningAlert, ConfirmAlert } from '../../../components/sweetalert';
import { Select , Input , Button , Card , message } from 'antd';


const EditRank = ({ params }) => {
    const [rankname, setRankName] = useState('');
    const [employeeAccess, setEmployeeAccess] = useState('');
    const [evaluationAccess, setEvaluationAccess] = useState('');
    const [overviewAccess, setOverviewAccess] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const { id } = params;


    const fetchRank = async (id) => {
        try {
            const response = await fetch(`/api/rank/${id}`);
            const data = await response.json();
            if (!response.ok) throw new Error('Failed to fetch rank data');

            setRankName(data.rankname);
            setEmployeeAccess(data.employee ? 'enable' : 'disable');
            setEvaluationAccess(data.evaluation ? 'enable' : 'disable');
            setOverviewAccess(data.overview ? 'enable' : 'disable');
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchRank(parseInt(id));
        }
        if (rankname) {
            fetchRank(parseInt(rankname));
        }
    }, [id], [rankname]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Convert string values 'enable'/'disable' to boolean
        const employeeBool = employeeAccess === 'enable';
        const evaluationBool = evaluationAccess === 'enable';
        const overviewBool = overviewAccess === 'enable';

        try {
            const response = await fetch(`/api/rank/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rankname,
                    employee: employeeBool,
                    evaluation: evaluationBool,
                    overview: overviewBool
                }),
            });

            if (!response.ok) throw new Error('Failed to update rank');

            SuccessAlert('สำเร็จ!', 'ข้อมูลถูกอัปเดตเรียบร้อยแล้ว');
            router.push('/admin/rank');
        } catch (error) {
            console.error(error);
            WarningAlert('ผิดพลาด!', 'ไม่สามารถอัปเดตข้อมูลได้');
        }
    };

    const handleDelete = async () => {
        ConfirmAlert('คุณแน่ใจที่จะลบข้อมูลนี้?', 'การดำเนินการนี้ไม่สามารถย้อนกลับได้', async () => {
            try {
                const response = await fetch(`/api/rank/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error('Failed to delete the Rank.');
                SuccessAlert('ลบสำเร็จ!', 'ข้อมูลถูกลบแล้ว');
                router.push('/admin/rank');
            } catch (error) {
                console.error('Failed to delete the Rank', error);
                WarningAlert('ผิดพลาด!', 'ไม่สามารถลบข้อมูลได้');
            }
        });
    };
    
    const handleBack = () => {
        router.push('/admin/rank');
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">แก้ไข {rankname}</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="max-w-6xl mx-auto px-4 py-8 shadow-xl">
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <label htmlFor="rankname" className="block mr-4 mb-4">
                                    <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span>ชื่อคณะ : </span>
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
                                onChange={(value) => setEmployeeAccess(value)}
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
                                onChange={(value) => setEvaluationAccess(value)}
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
                                onChange={(value) => setOverviewAccess(value)}
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
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' , padding: '8px 0' }}>
                            <Button className="inline-flex justify-center"
                                type="primary"
                                size="middle"
                                onClick={handleSubmit}
                                style={{ backgroundColor: '#02964F', borderColor: '#02964F', marginRight: '8px' }}
                            >
                                บันทึก
                            </Button>
                            <Button className="inline-flex justify-center"
                                type="primary" danger
                                size="middle"
                                onClick={handleDelete}
                                style={{ backgroundColor: '#E50000', borderColor: '#E50000', marginRight: '8px' }}
                            >
                                ลบ
                            </Button>
                            <Button className="inline-flex justify-center"
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

export default EditRank;
