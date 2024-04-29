'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

const UserList = () => {
    const [user, setUser] = useState([])
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchuser()
    }, [])

    const fetchuser = async () => {
        try {
            const res = await fetch('/api/getuser')
            const data = await res.json()
            setUser(data)
        } catch (error) {
            console.error('Failed to fetch user', error)
        } finally {
            setIsLoading(false);
        }
    }
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    const filtereduser = user.filter((user) => {
        return user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
               user.faculty?.facultyName.toLowerCase().includes(searchTerm.toLowerCase())||
               user.major?.majorName.toLowerCase().includes(searchTerm.toLowerCase())||
               user.rank?.rankname.toLowerCase().includes(searchTerm.toLowerCase())||
               user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
               user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
               user.role.toLowerCase().includes(searchTerm.toLowerCase()) ;
    });


    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold mb-6">ผู้ใช้</h1>
                <div className="flex items-center">
                    <input
                        type="text"
                        placeholder="ค้นหาผู้ใช้..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mt-4 inline-flex items-center px-4 py-2 border rounded-lg shadow-sm text-sm font-medium mr-4"
                    />
                    <Link
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        href="users_management/create"
                    >
                        เพิ่มผู้ใช้
                    </Link>
                </div>
            </div>
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full">
                    <thead className="bg-gray-50 ">
                        <tr>
                            <th scope="col" className="w-1 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                            <th scope="col" className="w-1/7 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">คณะ</th>
                            <th scope="col" className="w-1/7 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สาขา</th>
                            <th scope="col" className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ตำแหน่ง</th>
                            <th scope="col" className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อ</th>
                            <th scope="col" className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">นามสกุล</th>
                            <th scope="col" className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th scope="col" className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th scope="col" className="w-1/5 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">แก้ไข</th>
                        </tr>
                    </thead>
                </table>
                <div className="max-h-96 overflow-y-auto">
                    <table className="min-w-full">
                        <tbody className="divide-y divide-gray-200">
                            {filtereduser.length > 0 ? (
                                filtereduser.map((user, index) => (
                                    <tr key={user.id}>
                                        <td className="w-1 px-6 py-4 whitespace-nowrap">
                                            {index + 1}
                                        </td>
                                        <td className="w-1/7 px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {user.faculty?.facultyName}
                                            </div>
                                        </td>
                                        <td className="w-1/7 px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {user.major?.majorName}
                                            </div>
                                        </td>
                                        <td className="w-1/5 px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {user.rank?.rankname}
                                            </div>
                                        </td>
                                        <td className="w-1/5 px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {user.username}
                                            </div>
                                        </td>
                                        <td className="w-1/5 px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {user.lastname}
                                            </div>
                                        </td>
                                        <td className="w-1/5 px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="w-1/5 px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {user.role}
                                            </div>
                                        </td>
                                        <td className="w-1/5 px-6 py-4 text-right whitespace-nowrap">
                                            <Link
                                                className="text-indigo-600 hover:text-indigo-900"
                                                href={`/admin/user/${user.id}`}
                                            >
                                                แก้ไข
                                            </Link>
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
            </div>
        </div >
    )
}

export default UserList
