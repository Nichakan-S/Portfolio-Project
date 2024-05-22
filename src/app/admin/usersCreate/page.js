'use client'

import React, { useEffect, useState } from 'react';
import { SuccessAlert, WarningAlert } from '../../components/sweetalert';
import { Button, Avatar, Select, Card, Row, Col, Input } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const CreateUser = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [facultiesResponse, majorsResponse, positionsResponse] = await Promise.all([
                    fetch('/api/faculty'),
                    fetch('/api/major'),
                    fetch('/api/position'),
                ]);

                const faculties = await facultiesResponse.json();
                const majors = await majorsResponse.json();
                const positions = await positionsResponse.json();

                setFaculty(faculties);
                setMajors(majors);
                setPosition(positions);

                console.log(faculties)
                console.log(majors)
            } catch (error) {
                console.error('Failed to fetch data', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        majors.forEach(major => { });
        const newFilteredMajors = majors.filter(major => major.facultyId === parseInt(selectedFacultyId, 10));
        setFilteredMajors(newFilteredMajors);
    }, [selectedFacultyId, majors]);


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2097152) { // 2MB limit
                WarningAlert('ผิดพลาด!', 'ขนาดห้ามเกิน 2MB');
                e.target.value = '';
                return;
            }
            if (!file.type.match('image/png') && !file.type.match('image/jpeg')) {
                WarningAlert('ผิดพลาด!', 'ใช้ไฟล์ .png หรือ .jpg เท่านั้น');
                e.target.value = '';
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        if (password !== confirmPassword) {
            WarningAlert('ผิดพลาด!', 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const body = JSON.stringify({
            email,
            password,
            prefix,
            username,
            lastname,
            majorId: parseInt(majorId, 10),
            positionId: parseInt(positionId, 10),
            userImage: userImage,
            role
        });
        try {
            const response = await fetch('/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body,
            });

            if (!response.ok) throw new Error('เกิดข้อผิดพลาด');

            SuccessAlert('สำเร็จ!', 'ผู้ใช้ได้ถูกเพิ่มแล้ว');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setPrefix('');
            setUsername('');
            setLastname('');
            setFacultyId('');
            setMajorId('');
            setPositionId('');
            setUserImage('');
            setRole('');
            setSelectedFacultyId('');
        } catch (error) {
            console.error(error);
            WarningAlert('ผิดพลาด!', 'ไม่สามารถเพิ่มผู้ใช้ได้');
        }
    };

    const handleFileInputClick = () => {
        document.getElementById('hiddenFileInput').click();
    };

    return (
        <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-2xl font-semibold mb-6">เพิ่มผู้ใช้ใหม่</h1>
            <div style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data" >
                    <Card className="max-w-6xl mx-auto px-4 py-8 shadow-xl" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                        <Row gutter={16}>
                            <Col span={6}>
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
                                        <label htmlFor="position" className="block text-base font-medium mr-4">
                                            <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> ตำแหน่ง : </span>
                                        </label>
                                        <Select
                                            id="position"
                                            value={positionId}
                                            onChange={(value) => setPositionId(value)}
                                            className="flex-grow mr-4 custom-select"
                                            style={{
                                                width: '50%',
                                                borderColor: '#DADEE9',
                                                fontSize: '16px',
                                                height: '40px'
                                            }}
                                        >
                                            <Select.Option value="">กรุณาเลือกตำแหน่ง</Select.Option>
                                            {position.map((position) => (
                                                <Select.Option key={position.id} value={position.id}>
                                                    {position.name}
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
                                    <div style={{ display: 'flex', alignItems: 'center', width: '50%' }}>
                                        <label htmlFor="password" className="block text-base font-medium mr-4">
                                            <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> รหัสผ่าน : </span>
                                        </label>
                                        <Input
                                            placeholder="รหัสผ่าน"
                                            name="password"
                                            id="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="flex-grow mr-4"
                                            style={{
                                                flexGrow: 1,
                                                flexShrink: 1,
                                                flexBasis: 'calc(100% - 150px)', // Adjust size based on label width
                                                padding: '8px',
                                            }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', width: '50%' }}>
                                        <label htmlFor="confirmpassword" className="block text-base font-medium mr-4">
                                            <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> ยืนยันรหัสผ่าน : </span>
                                        </label>
                                        <Input
                                            placeholder="ยืนยันรหัสผ่าน"
                                            name="confirmpassword"
                                            id="confirmpassword"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="flex-grow mr-4"
                                            style={{
                                                flexGrow: 1,
                                                flexShrink: 1,
                                                flexBasis: 'calc(100% - 150px)', // Adjust size based on label width
                                                padding: '8px',
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
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </form>
            </div>
        </div>
    );
};

export default CreateUser;
