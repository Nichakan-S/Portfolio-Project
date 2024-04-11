'use client'

import { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // เมื่อ status เป็น 'authenticated' และมี session.user.id ที่ถูกต้อง
    if (status === 'authenticated' && session?.user?.id) {
      const fetchUserData = async () => {
        const res = await fetch(`/api/user/${session.user.id}`); // path ที่ถูกต้องตาม backend
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          // ถ้า fetch ไม่สำเร็จ, ให้ logout
          signOut({ callbackUrl: '/' });
        }
        setIsLoading(false);
      };

      fetchUserData();
    } else if (status === 'unauthenticated') {
      // ถ้าไม่ได้เข้าสู่ระบบ, ให้ไปที่หน้า login
      signIn('credentials', { callbackUrl: '/' });
    }
  }, [status, session]);


  if (isLoading || !user) {
    return <div>กำลังโหลด...</div>;
  }

  if (user.role === 'admin') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="bg-white p-6 rounded-md shadow-md">
          <p>ยินดีต้อนรับ admin, <b>{user.username}!</b></p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            ออกจากระบบ
          </button>
        </div>
      </div>
    );
  } else {
    signOut({ callbackUrl: '/' });
    return null;
  }
}

