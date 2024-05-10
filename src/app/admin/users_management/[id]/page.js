'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SuccessAlert, WarningAlert, ConfirmAlert } from '../../../components/sweetalert';


const EditUser = ({ params }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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
    const [showPasswordFields, setShowPasswordFields] = useState(false);
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
            if (file.size > 2097152) {
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
        if (password && confirmPassword) {
            if (password !== confirmPassword) {
                WarningAlert('ผิดพลาด!', 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน');
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

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
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">แก้ไขข้อมูลผู้ใช้</h1>
            <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                <div>
                    <label htmlFor="userImage" className="block text-sm font-medium text-gray-700 mt-4">
                        รูปภาพผู้ใช้
                    </label>
                    <input
                        type="file"
                        name="userImage"
                        id="userImage"
                        accept=".jpg, .png"
                        onChange={handleImageChange}
                        className="p-2 mt-1 block w-full text-lg"
                    />
                    {userImage && (
                        <div className="mt-4">
                            <p>Preview:</p>
                            <img src={userImage} alt="Preview" className="max-w-xs" />
                        </div>
                    )}
                </div>
                <div>
                    <label htmlFor="faculty" className="block text-sm font-medium text-gray-700">
                        เลือกคณะ
                    </label>
                    <select
                        id="faculty"
                        required
                        value={facultyId}
                        onChange={(e) => {
                            const newFacultyId = e.target.value;
                            setFacultyId(newFacultyId);
                            setSelectedFacultyId(newFacultyId);
                            setMajorId('');
                        }}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="">กรุณาเลือกคณะ</option>
                        {faculty.map(faculty => (
                            <option key={faculty.id} value={faculty.id}>
                                {faculty.facultyName}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="major" className="block text-sm font-medium text-gray-700 mt-4">
                        เลือกสาขา
                    </label>
                    <select
                        id="major"
                        required
                        value={majorId}
                        onChange={(e) => setMajorId(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="">กรุณาเลือกสาขา</option>
                        {filteredMajors.map(major => (
                            <option key={major.id} value={major.id}>
                                {major.majorName}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="rank" className="block text-sm font-medium text-gray-700 mt-4">
                        ตำแหน่ง
                    </label>
                    <select
                        id="rank"
                        required
                        value={rankId}
                        onChange={(e) => setRankId(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="">กรุณาเลือกตำแหน่ง</option>
                        {rank.map((rank) => (
                            <option key={rank.id} value={rank.id}>
                                {rank.rankname}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="prefix" className="block text-sm font-medium text-gray-700">
                        คำนำหน้าชื่อ
                    </label>
                    <select
                        id="prefix"
                        required
                        value={prefix}
                        onChange={(e) => setPrefix(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="">กรุณาเลือกคำนำหน้าชื่อ</option>
                        <option value="นาย">นาย</option>
                        <option value="นาง">นาง</option>
                        <option value="นางสาว">นางสาว</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mt-4">
                        ชื่อ
                    </label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="p-2 mt-1 block w-full h-12 rounded-lg border-gray-300 shadow-lg focus:border-indigo-500 focus:ring-indigo-500 text-lg"
                    />
                </div>
                <div>
                    <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mt-4">
                        นามสกุล
                    </label>
                    <input
                        type="text"
                        name="lastname"
                        id="lastname"
                        required
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                        className="p-2 mt-1 block w-full h-12 rounded-lg border-gray-300 shadow-lg focus:border-indigo-500 focus:ring-indigo-500 text-lg"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mt-4">
                        Email
                    </label>
                    <input
                        type="text"
                        name="email"
                        id="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-2 mt-1 block w-full h-12 rounded-lg border-gray-300 shadow-lg focus:border-indigo-500 focus:ring-indigo-500 text-lg"
                    />
                </div>
                <div>
                    <label htmlFor="togglePasswordFields" className="block text-sm font-medium text-gray-700">
                        เปลี่ยนรหัสผ่าน
                    </label>
                    <input
                        type="checkbox"
                        id="togglePasswordFields"
                        checked={showPasswordFields}
                        onChange={() => setShowPasswordFields(!showPasswordFields)}
                        className="mt-1"
                    />
                </div>
                {showPasswordFields && (
                    <>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mt-4">
                                รหัสผ่าน
                            </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="p-2 mt-1 block w-full h-12 rounded-lg border-gray-300 shadow-lg focus:border-indigo-500 focus:ring-indigo-500 text-lg"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmpassword" className="block text-sm font-medium text-gray-700 mt-4">
                                ยืนยันรหัสผ่าน
                            </label>
                            <input
                                type="password"
                                name="confirmpassword"
                                id="confirmpassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="p-2 mt-1 block w-full h-12 rounded-lg border-gray-300 shadow-lg focus:border-indigo-500 focus:ring-indigo-500 text-lg"
                            />
                        </div>
                    </>

                )}
                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                        บทบาท
                    </label>
                    <select
                        id="role"
                        required
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="">กรุณาเลือกบทบาท</option>
                        <option value="user">ผู้ใช้งาน</option>
                        <option value="admin">ผู้ดูแลระบบ</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="mr-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    บันทึก
                </button>
                <button
                    type="button"
                    onClick={handleDelete}
                    className="mr-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    ลบ
                </button>
                <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                    ยกเลิก
                </button>
            </form>
        </div>
    );
};

export default EditUser;