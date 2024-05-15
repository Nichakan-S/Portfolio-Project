'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Descriptions, Card, Input, Button } from 'antd';
import { EditFilled } from '@ant-design/icons';
import { SuccessAlert, WarningAlert } from '../../components/sweetalert';
import * as XLSX from 'xlsx';
import '/src/app/globals.css';

const DayEnum = {
    mon: 'จันทร์',
    tue: 'อังคาร',
    wed: 'พุธ',
    thu: 'พฤหัสบดี',
    fri: 'ศุกร์',
    sat: 'เสาร์',
    sun: 'อาทิตย์',
};

const convertExcelTime = (excelTime) => {
    const totalMinutes = Math.round(excelTime * 24 * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

const SubjectList = () => {
    const [subjects, setSubjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [file, setFile] = useState(null);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await fetch('/api/subject');
                const data = await res.json();
                setSubjects(data);
            } catch (error) {
                console.error('การเรียกข้อมูลวิชาล้มเหลว', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSubjects();
    }, []);

    const handleFileUpload = async (e) => {
        e.preventDefault();

        if (!file) {
            console.error('กรุณาเลือกไฟล์ก่อนอัพโหลด');
            return;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet);
            const correctedData = json.map(subject => ({
                ...subject,
                starttime: convertExcelTime(subject.starttime),
                endtime: convertExcelTime(subject.endtime),
                group: String(subject.group),
            }));

            try {
                const res = await fetch('/api/excelSubject', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(correctedData),
                });

                if (res.ok) {
                    const result = await res.json();
                    SuccessAlert('สำเร็จ!', 'ข้อมูลได้ถูกบันทึกแล้ว');
                    setSubjects([...subjects, ...result.createdSubjects]);
                } else {
                    console.error('Failed to upload file');
                    WarningAlert('ผิดพลาด!', 'ไม่สามารถบันทึกข้อมูลได้');
                }
            } catch (error) {
                console.error('Failed to upload file', error);
                WarningAlert('ผิดพลาด!', 'ไม่สามารถบันทึกข้อมูลได้');
            }
        };

        reader.readAsArrayBuffer(file);
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

    const filteredSubjects = subjects.filter(subject => {
        return subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               DayEnum[subject.day]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               subject.group.toLowerCase().includes(searchTerm.toLowerCase()) ||
               subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
               subject.starttime.toLowerCase().includes(searchTerm.toLowerCase()) ||
               subject.endtime.toLowerCase().includes(searchTerm.toLowerCase()) ||
               subject.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
               subject.year.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold mb-6">วิชา</h1>
                <div className="flex items-center space-x-2">
                    <Input
                        className="flex-grow p-1 text-base border rounded-xl custom-input"
                        placeholder="ค้นหาวิชา..."
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ borderColor: '#2D427C', fontSize: '14px' }}
                    />
                    <Link href="subject/create">
                        <Button
                            className="text-base p-1 border rounded-xl"
                            style={{
                                backgroundColor: '#2D427C',
                                borderColor: '#2D427C',
                                color: 'white',
                                height: '35px',
                                borderWidth: '2px',
                                fontSize: '18px',
                            }}
                        >
                            เพิ่มวิชา
                        </Button>
                    </Link>
                    <form onSubmit={handleFileUpload} className="flex items-center space-x-2">
                        <Input
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="p-1 text-base border rounded-xl"
                            style={{ fontSize: '14px' }}
                        />
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="text-base p-1 border rounded-xl"
                            style={{
                                backgroundColor: '#2D427C',
                                borderColor: '#2D427C',
                                color: 'white',
                                height: '35px',
                                borderWidth: '2px',
                                fontSize: '18px',
                            }}
                        >
                            อัพโหลดไฟล์
                        </Button>
                    </form>
                </div>
            </div>
            {filteredSubjects.length > 0 ? (
                filteredSubjects.map((subject, index) => (
                    <Card
                        key={subject.id}
                        className="max-w-6xl mx-auto px-4 py-6 shadow-xl small-card"
                        style={{ headerHeight: '38px' }}
                        title={`วิชา ${index + 1}`}
                    >
                        <Descriptions layout="horizontal" size="small" className="small-descriptions">
                            <Descriptions.Item label="ชื่อวิชา">{subject.name}</Descriptions.Item>
                            <Descriptions.Item label="รหัสวิชา">{subject.code}</Descriptions.Item>
                            <Descriptions.Item label="วันสอน">{DayEnum[subject.day]}</Descriptions.Item>
                            <Descriptions.Item label="กลุ่มเรียน">{subject.group}</Descriptions.Item>
                            <Descriptions.Item label="เวลาเริ่ม">{subject.starttime}</Descriptions.Item>
                            <Descriptions.Item label="เวลาจบ">{subject.endtime}</Descriptions.Item>
                            <Descriptions.Item label="เทอม">{subject.term}</Descriptions.Item>
                            <Descriptions.Item label="ปีการศึกษา">{subject.year}</Descriptions.Item>
                        </Descriptions>
                        <div className="text-right">
                            <Link href={`/admin/subject/${subject.id}`}>
                                <Button
                                    type="link"
                                    icon={<EditFilled style={{ fontSize: '20px', color: '#FFD758' }} />}
                                />
                            </Link>
                        </div>
                    </Card>
                ))
            ) : (
                <div className="text-center text-sm font-medium">ไม่มีข้อมูล</div>
            )}
        </div>
    );
};

export default SubjectList;
