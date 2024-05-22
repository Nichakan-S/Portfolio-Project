'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SuccessAlert, WarningAlert, ConfirmAlert } from '../../../components/sweetalert';
import { Button, Avatar, Select, Card, Row, Col, Input } from 'antd';
import { UploadOutlined } from '@ant-design/icons';


const EditUser = ({ params }) => {
    const [email, setEmail] = useState('');
    const [prefix, setPrefix] = useState('');
    const [username, setUsername] = useState('');
    const [lastname, setLastname] = useState('');
    const [facultyId, setFacultyId] = useState('');
    const [majorId, setMajorId] = useState('');
    const [rankId, setRankId] = useState('');
    const [userImage, setUserImage] = useState('');
    const [role, setRole] = useState('');
    const [faculty, setFaculty] = useState([]);
    const [majors, setMajors] = useState([]);
    const [rank, setRank] = useState([]);
    const [selectedFacultyId, setSelectedFacultyId] = useState('');
    const [filteredMajors, setFilteredMajors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();
    const { id } = params;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userResponse, facultiesResponse, majorsResponse, ranksResponse] = await Promise.all([
                    fetch(`/api/user/${id}`),
                    fetch('/api/faculty'),
                    fetch('/api/major'),
                    fetch('/api/rank'),
                ]);

                const user = await userResponse.json();
                const faculties = await facultiesResponse.json();
                const majors = await majorsResponse.json();
                const ranks = await ranksResponse.json();

                console.log(user);

                setEmail(user.email);
                setPrefix(user.prefix);
                setUsername(user.username);
                setLastname(user.lastname);
                setFacultyId(user.facultyId.toString());
                setMajorId(user.majorId.toString());
                setRankId(user.rankId.toString());
                setUserImage(user.user_image);
                setRole(user.role);
                setFaculty(faculties);
                setMajors(majors);
                setRank(ranks);
                setSelectedFacultyId(user.facultyId.toString());
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
            if (file.size > 2097152) { // 2MB limit
                WarningAlert('ผิดพลาด!', 'ขนาดห้ามเกิน 2MB');
                return;
            }
            if (!file.type.match('image/png') && !file.type.match('image/jpeg')) {
                WarningAlert('ผิดพลาด!', 'ใช้ไฟล์ .png หรือ .jpg เท่านั้น');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserImage(reader.result); // Update the state with the base64 URL for preview
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
            facultyId: parseInt(facultyId, 10),
            majorId: parseInt(majorId, 10),
            rankId: parseInt(rankId, 10),
            user_image: userImage,
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
            router.push('/admin/users_management');
        } catch (error) {
            console.error(error);
            WarningAlert('ผิดพลาด!', 'ไม่สามารถอัพเดตผู้ใช้ได้');
        }
    };

    const handleDelete = async () => {
        ConfirmAlert('คุณแน่ใจที่จะลบข้อมูลนี้?', 'การดำเนินการนี้ไม่สามารถย้อนกลับได้', async () => {
            try {
                const response = await fetch(`/api/user/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error('Failed to delete the user.');
                SuccessAlert('ลบสำเร็จ!', 'ข้อมูลถูกลบแล้ว');
                router.push('/admin/user_management');
            } catch (error) {
                console.error('Failed to delete the user', error);
                WarningAlert('ผิดพลาด!', 'ไม่สามารถลบข้อมูลได้');
            }
        });
    };

    const handleBack = () => {
        router.push('/admin/users_management');
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
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">แก้ไขข้อมูลผู้ใช้</h1>
            <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
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
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                                    <label htmlFor="faculty" className="block text-base font-medium mr-4 mb-4">
                                        <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> คณะ : </span>
                                    </label>
                                    <Select
                                        id="faculty"
                                        value={facultyId}
                                        onChange={(newFacultyId) => {
                                            setFacultyId(newFacultyId);
                                            setSelectedFacultyId(newFacultyId);
                                            setMajorId('');
                                        }}
                                        className="flex-grow mr-4 mb-4 custom-select"
                                        size="large"
                                        style={{
                                            width: '80%',
                                            borderColor: '#DADEE9',
                                            fontSize: '16px',
                                            height: '40px'
                                        }}
                                    >
                                        <Select.Option value="">กรุณาเลือกคณะ</Select.Option>
                                        {faculty.map((faculty) => (
                                            <Select.Option key={faculty.id} value={faculty.id}>
                                                {faculty.facultyName}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                                    <label htmlFor="major" className="block text-base font-medium mr-4 mb-4">
                                        <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> สาขา : </span>
                                    </label>
                                    <Select
                                        id="major"
                                        value={majorId}
                                        onChange={(newMajorId) => setMajorId(newMajorId)}
                                        className="flex-grow mr-4 mb-4 custom-select"
                                        size="large"
                                        style={{
                                            width: '80%',
                                            borderColor: '#DADEE9',
                                            fontSize: '16px',
                                            height: '40px'
                                        }}
                                    >
                                        <Select.Option value="">กรุณาเลือกสาขา</Select.Option>
                                        {filteredMajors.map((major) => (
                                            <Select.Option key={major.id} value={major.id}>
                                                {major.majorName}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', width: '50%' }}>
                                    <label htmlFor="rank" className="block text-base font-medium mr-4">
                                        <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> ตำแหน่ง : </span>
                                    </label>
                                    <Select
                                        id="rank"
                                        value={rankId}
                                        onChange={(value) => setRankId(value)}
                                        className="flex-grow mr-4 custom-select"
                                        style={{
                                            width: '50%',
                                            borderColor: '#DADEE9',
                                            fontSize: '16px',
                                            height: '40px'
                                        }}
                                    >
                                        <Select.Option value="">กรุณาเลือกตำแหน่ง</Select.Option>
                                        {rank.map((rank) => (
                                            <Select.Option key={rank.id} value={rank.id}>
                                                {rank.rankname}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </div>
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
                                    <label htmlFor="username" className="block text-base font-medium mr-4 mb-4">
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
                            <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                    <label htmlFor="email" className="block text-base font-medium mr-4 mb-4">
                                        <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> Email : </span>
                                    </label>
                                    <Input
                                        placeholder="อีเมล"
                                        name="email"
                                        id="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
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
                            <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                    <label htmlFor="role" className="block text-base font-medium mr-4">
                                        <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> บทบาท : </span>
                                    </label>
                                    <Select
                                        id="role"
                                        value={role}
                                        onChange={(value) => setRole(value)}
                                        className="flex-grow mr-4 custom-select"
                                        style={{
                                            width: '50%',
                                            borderColor: '#DADEE9',
                                            fontSize: '16px',
                                            height: '40px'
                                        }}
                                    >
                                        <Select.Option value="">กรุณาเลือกบทบาท</Select.Option>
                                        <Select.Option value="user">ผู้ใช้งาน</Select.Option>
                                        <Select.Option value="admin">ผู้ดูแลระบบ</Select.Option>
                                    </Select>
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
    );
};

export default EditUser;