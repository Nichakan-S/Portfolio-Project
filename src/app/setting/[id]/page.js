'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SuccessAlert, WarningAlert, ConfirmAlert } from '../../components/sweetalert';
import { Button, Avatar, Select, Card, Row, Col, Input } from 'antd';
import { UploadOutlined } from '@ant-design/icons';


const EditUser = ({ params }) => {
    const [email, setEmail] = useState('');
    const [prefix, setPrefix] = useState('');
    const [username, setUsername] = useState('');
    const [lastname, setLastname] = useState('');
    const [facultyId, setFacultyId] = useState('');
    const [majorId, setMajorId] = useState('');
    const [positionId, setPositionId] = useState('');
    const [userImage, setUserImage] = useState('');
    const [role, setRole] = useState('');
    const [faculty, setFaculty] = useState([]);
    const [majors, setMajors] = useState([]);
    const [position, setPosition] = useState([]);
    const [selectedFacultyId, setSelectedFacultyId] = useState('');
    const [filteredMajors, setFilteredMajors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();
    const { id } = params;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userResponse, facultiesResponse, majorsResponse, positionsResponse] = await Promise.all([
                    fetch(`/api/user/${id}`),
                    fetch('/api/faculty'),
                    fetch('/api/major'),
                    fetch('/api/position'),
                ]);
    
                const user = await userResponse.json();
                const faculties = await facultiesResponse.json();
                const majors = await majorsResponse.json();
                const positions = await positionsResponse.json();
    
                console.log('User:', user);
                console.log('Faculties:', faculties);
                console.log('Majors:', majors);
                console.log('Positions:', positions);
    
                setEmail(user.email);
                setPrefix(user.prefix);
                setUsername(user.username);
                setLastname(user.lastname);
                setFacultyId(user.major.faculty.id.toString());
                setMajorId(user.major.id.toString());
                setPositionId(user.position.id.toString());
                setUserImage(user.userImage);
                setRole(user.role);
                setFaculty(faculties);
                setMajors(majors);
                setPosition(positions);
                setSelectedFacultyId(user.major.faculty.id.toString());
            } catch (error) {
                console.error('Failed to fetch data', error);
            } finally {
                setIsLoading(false);
            }
        };
    
        if (id) fetchData();
    }, [id]);    

    useEffect(() => {
        if (facultyId) {
            const newFilteredMajors = majors.filter(major => major.facultyId.toString() === facultyId);
            setFilteredMajors(newFilteredMajors);
        }
    }, [facultyId, majors]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2097152) {
                WarningAlert('ผิดพลาด!', 'ขนาดห้ามเกิน 2MB');
                return;
            }
            if (!file.type.match('image/png') && !file.type.match('image/jpeg')) {
                WarningAlert('ผิดพลาด!', 'ใช้ไฟล์ .png หรือ .jpg เท่านั้น');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const body = JSON.stringify({
            email,
            prefix,
            username,
            lastname,
            majorId: parseInt(majorId, 10),
            positionId: parseInt(positionId, 10),
            userImage: userImage,
            role
        });

        try {
            const response = await fetch(`/api/user/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body,
            });

            if (!response.ok) throw new Error('เกิดข้อผิดพลาด');

            SuccessAlert('สำเร็จ!', 'ข้อมูลผู้ใช้ได้ถูกอัพเดตแล้ว');
            window.history.back();
        } catch (error) {
            console.error(error);
            WarningAlert('ผิดพลาด!', 'ไม่สามารถอัพเดตผู้ใช้ได้');
        }
    };

    const handleBack = () => {
        window.history.back();
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

    const handleUpload = ({ file }) => {
        const reader = new FileReader();
        reader.onload = () => {
            setUserImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleFileInputClick = () => {
        document.getElementById('hiddenFileInput').click();
    };

    return (
        <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-2xl font-semibold mb-6">แก้ไขข้อมูลผู้ใช้</h1>
            <div style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                    <Card className="max-w-6xl mx-auto px-4 py-8 shadow-xl" >
                        <Row gutter={16} >
                            <Col span={6} >
                                <div className="upload-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 20, justifyContent: 'flex-end' }}>
                                    {userImage && (
                                        <Avatar
                                            size={128}
                                            src={userImage}
                                            style={{ marginBottom: 10 }}
                                        />
                                    )}
                                    <Button
                                        type="primary"
                                        icon={<UploadOutlined />}
                                        onClick={handleFileInputClick}
                                        style={{ backgroundColor: "white", color: "black", borderColor: "gray" }}
                                        className="shadow-xl"
                                    >
                                        Upload Image
                                    </Button>
                                    <input
                                        type="file"
                                        id="hiddenFileInput"
                                        style={{ display: 'none' }}
                                        accept=".jpg, .png"
                                        onChange={handleImageChange}
                                    />
                                </div>
                            </Col>
                            <Col span={18}>
                                <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', width: '50%' }}>
                                        <label htmlFor="prefix" className="block text-base font-medium mr-4">
                                            <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> คำนำหน้าชื่อ : </span>
                                        </label>
                                        <Select
                                            id="prefix"
                                            value={prefix}
                                            onChange={(value) => setPrefix(value)}
                                            className="flex-grow mr-4 custom-select"
                                            style={{
                                                width: '50%',
                                                borderColor: '#DADEE9',
                                                fontSize: '16px',
                                                height: '40px'
                                            }}
                                        >
                                            <Select.Option value="">กรุณาเลือกคำนำหน้าชื่อ</Select.Option>
                                            <Select.Option value="นาย">นาย</Select.Option>
                                            <Select.Option value="นาง">นาง</Select.Option>
                                            <Select.Option value="นางสาว">นางสาว</Select.Option>
                                        </Select>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                        <label htmlFor="username" className="block text-base font-medium mr-4">
                                            <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> ชื่อ : </span>
                                        </label>
                                        <Input
                                            placeholder="ชื่อผู้ใช้"
                                            name="username"
                                            size="large"
                                            id="username"
                                            required
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="flex-grow mr-4"
                                            style={{
                                                flexGrow: 1,
                                                flexShrink: 1,
                                                flexBasis: '50%',
                                                padding: '8px',
                                                minWidth: '300px'
                                            }}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                        <label htmlFor="lastname" className="block text-base font-medium mr-4 mb-4">
                                            <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> นามสกุล : </span>
                                        </label>
                                        <Input
                                            placeholder="นามสกุล"
                                            name="lastname"
                                            id="lastname"
                                            required
                                            value={lastname}
                                            onChange={(e) => setLastname(e.target.value)}
                                            className="flex-grow mr-4 mb-4"
                                            style={{
                                                flexGrow: 1,
                                                flexShrink: 1,
                                                flexBasis: '50%',
                                                padding: '8px',
                                                minWidth: '300px'
                                            }}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '102%', padding: '15px' }}>
                                    <Button
                                        className="inline-flex justify-center mr-4 mb-4"
                                        type="primary"
                                        size="middle"
                                        onClick={handleSubmit}
                                        style={{
                                            color: 'white',
                                            backgroundColor: '#02964F',
                                            borderColor: '#02964F',
                                        }}
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
                            </Col>
                        </Row>
                    </Card>
                </form>
            </div>
        </div>
    );
};

export default EditUser;