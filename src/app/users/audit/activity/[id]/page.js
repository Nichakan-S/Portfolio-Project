'use client'

import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, Select } from 'antd';
import { SuccessAlert, WarningAlert, EvaluationAlert } from '../../../../components/sweetalert';

const audit = {
    wait: 'รอตรวจ',
    pass: 'ผ่าน',
    fail: 'ไม่ผ่าน'
};

const ActivityList = ({ params }) => {
    const { id } = params;
    const [activity, setActivity] = useState([]);
    const [selectTerm, setSelectTerm] = useState('all');
    const [inputTerm, setInputTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState('');

    useEffect(() => {
        fetchactivity(Number(params.id));
    }, [params.id]);

    const fetchactivity = async (id) => {
        if (isNaN(id)) {
            console.error('Invalid majorId:', id);
            setIsLoading(false);
            return;
        }
        try {
            const res = await fetch(`/api/auditActivity/${id}`);
            if (!res.ok) {
                const errorDetails = await res.json();
                throw new Error(errorDetails.details || 'Unknown error occurred');
            }
            const data = await res.json();
            console.log('activity data fetched:', data);
            setActivity(data);
        } catch (error) {
            console.error('Failed to fetch activity:', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (audit, id) => {
        EvaluationAlert('ยืนยันการประเมิน', 'คุณแน่ใจหรือไม่ที่จะทำการประเมินผลงานนี้?')
            .then(async (result) => {
                if (result.isConfirmed) {
                    console.log(audit, id);
                    try {
                        const response = await fetch(`/api/auditActivity/${id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ audit })
                        });
                        if (!response.ok) throw new Error('Something went wrong');
                        SuccessAlert('สำเร็จ!', 'ข้อมูลได้ถูกประเมินแล้ว');
                        fetchactivity(params.id);
                    } catch (error) {
                        console.error(error);
                        WarningAlert('ผิดพลาด!', 'ไม่สามารถประเมินข้อมูลได้');
                    }
                }
            }).catch((error) => {
                console.error('Promise error:', error);
            });
    };

    const showModal = (file, id) => {
        setModalContent({ file, id });
        console.log(file, id);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
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

    const filteredActivity = Array.isArray(activity) ? activity.filter((activity) => {
        return (
            (selectTerm === 'all' || audit[activity.audit] === selectTerm) &&
            (
                activity.activity?.name.toLowerCase().includes(inputTerm.toLowerCase()) ||
                activity.activity?.type.toLowerCase().includes(inputTerm.toLowerCase()) ||
                activity.activity?.year.toString().toLowerCase().includes(inputTerm.toLowerCase())
            )
        );
    }) : [];

    return (
        <div className="max-w-6xl mx-auto px-4 mt-2">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold mb-6">ตรวจสอบผลงานกิจกรรม</h1>
                <div className="flex items-center">
                    <Input
                        type="text"
                        placeholder="ค้นหาผลงานกิจกรรม..."
                        value={inputTerm}
                        onChange={(e) => setInputTerm(e.target.value)}
                        className="flex-grow mr-2"
                    />
                    <Select
                        value={selectTerm}
                        onChange={(value) => setSelectTerm(value)}
                        className="flex-grow"
                        style={{
                            flexBasis: '0%',
                            flexGrow: 1,
                            width: '100%',
                            borderColor: '#DADEE9',
                            minWidth: '100px'
                        }}
                        options={[
                            { value: 'all', label: 'ทั้งหมด' },
                            { value: 'รอ', label: 'รอ' },
                            { value: 'ผ่าน', label: 'ผ่าน' },
                            { value: 'ไม่ผ่าน', label: 'ไม่ผ่าน' }
                        ]}
                    />
                    
                </div>
            </div>
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full">
                    <thead className="bg-gray-50 ">
                        <tr>
                            <th scope="col" className="w-1 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                            <th scope="col" className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อกิจกรรม</th>
                            <th scope="col" className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ประเภท</th>
                            <th scope="col" className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ปี</th>
                            <th scope="col" className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                            <th scope="col" className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อเจ้าของผลงาน</th>
                            <th scope="col" className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ไฟล์</th>
                            <th scope="col" className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ตรวจสอบ</th>
                        </tr>
                    </thead>
                </table>
                <div className="max-h-96 overflow-y-auto">
                    <table className="min-w-full">
                        <tbody className="divide-y divide-gray-200">
                            {filteredActivity.length > 0 ? (
                                filteredActivity.map((activity, index) => (
                                    <tr key={activity.id}>
                                        <td className="w-1 px-6 py-4 whitespace-nowrap">
                                            {index + 1}
                                        </td>
                                        <td className="w-1/5 px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {activity.activity?.name}
                                            </div>
                                        </td>
                                        <td className="w-1/5 px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {activity.activity?.type === 'culture' ? 'ศิลปะวัฒนธรรม' : 'บริการวิชาการ'}
                                            </div>
                                        </td>
                                        <td className="w-1/5 px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {activity.activity?.year}
                                            </div>
                                        </td>
                                        <td className="w-1/5 px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {audit[activity.audit]}
                                            </div>
                                        </td>
                                        <td className="w-1/5 px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {activity.user?.username}
                                            </div>
                                        </td>
                                        <td className="w-1/5 px-6 py-4 whitespace-nowrap">
                                            <Button
                                                onClick={() => showModal(activity.file, activity.id)}
                                                type="link"
                                                style={{ color: '#FFD758' }}
                                            >
                                                เปิดไฟล์
                                            </Button>
                                        </td>
                                        <td className="w-1/5 px-6 py-4 whitespace-nowrap">
                                            <Button
                                                type="primary"
                                                className="mr-2"
                                                style={{ backgroundColor: '#02964F', borderColor: '#02964F' }}
                                                onClick={() => handleSubmit('pass', activity.id)}
                                            >
                                                ผ่าน
                                            </Button>
                                            <Button
                                                type="primary"
                                                danger
                                                className="mr-2"
                                                style={{ backgroundColor: '#E50000', borderColor: '#E50000' }}
                                                onClick={() => handleSubmit('fail', activity.id)}
                                            >
                                                ไม่ผ่าน
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        ไม่มีข้อมูล
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Modal
                    title="Preview File"
                    open={isModalVisible}
                    onCancel={closeModal}
                    footer={[
                        <div key="footer" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <Button key="download" type="primary" href={modalContent.file} target="_blank" download>
                                ดาวน์โหลด PDF
                            </Button>
                            <div>
                                <Button key="cancel" onClick={closeModal}>
                                    ยกเลิก
                                </Button>
                            </div>
                        </div>
                    ]}
                    width="70%"
                    style={{ top: 20 }}
                >
                    {modalContent ? (
                        <iframe src={modalContent.file} loading="lazy" style={{ width: '100%', height: '75vh' }}></iframe>
                    ) : (
                        <p>Error displaying the document. Please try again.</p>
                    )}
                </Modal>
            </div>
        </div>
    )
}

export default ActivityList;
