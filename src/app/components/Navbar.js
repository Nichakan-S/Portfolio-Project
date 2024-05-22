'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Avatar, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const Navbar = ({ isAdmin }) => {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      const fetchUserData = async () => {
        const res = await fetch(`/api/user/${session.user.id}`);
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          signOut({ callbackUrl: '/' });
        }
        setIsLoading(false);
      };
      fetchUserData();
    } else if (status === 'unauthenticated') {
      signIn('credentials', { callbackUrl: '/' });
    }
  }, [status, session]);

  const handleLogoutClick = () => {
    signOut({ redirect: true, callbackUrl: '/' });
  };

  const handleSettingsClick = () => {
    router.push(`/users/setting/${session.user.id}`);
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <nav className="p-6 ">
          <div className="bg-yellow-400 shadow-xl w-full p-3 flex items-center justify-between rounded-lg">
            <div className="flex items-center">
              <div className="ml-3 bg-white bg-opacity-50 p-2 rounded h-6 w-52 animate-pulse"></div>
            </div>
            <div className="flex items-center">
              <div>
                <div className="bg-white bg-opacity-50 p-2 rounded h-6 w-40 animate-pulse">
                </div>
                <div className="bg-white bg-opacity-50 p-2 rounded h-6 w-40 animate-pulse">
                </div>
              </div>
              <div className="ml-4">
                <div className="rounded-full bg-white bg-opacity-50 w-12 h-12 animate-pulse"></div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    );
  }

  return (
    <div className="w-full">
      <nav className="p-6">
        <div className="bg-yellow-400 shadow-xl w-full p-3 flex items-center justify-between rounded-lg">
          <div className="flex items-center">
            <div className="ml-3">
              <div className="text-xl text-black font-bold">Professor Portfolio - แฟ้มรวมผลงานอาจารย์</div>
            </div>
          </div>
          <div className="flex items-center">
            <div>
              <div className="text-black">{`${user.position.name} ${user.prefix} ${user.username} ${user.lastname}`}</div>
              <div className="text-right text-black">{user.email}</div>
            </div>
            <div className="ml-4">
              <div onClick={() => setDropdownOpen(!isDropdownOpen)} className="cursor-pointer">
                {user.userImage ? (
                  <Space wrap size={16}>
                    <Avatar
                      size={50}
                      src={user.userImage || '/image/none_image.png'}
                      icon={!user.userImage && <UserOutlined />}
                      onError={() => true}
                    />
                  </Space>
                ) : (
                  <Image
                    src="/image/none_image.png"
                    alt="Default profile image"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
              </div>
              {isDropdownOpen && (
                <div className="absolute right-6 w-48 bg-[#000c17] rounded-md shadow-xl">
                  <button
                    onClick={handleSettingsClick}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:text-yellow-400"
                  >
                    ตั้งค่าโปรไฟล์
                  </button>
                  <button
                    onClick={handleLogoutClick}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:text-yellow-400"
                  >
                    ออกจากระบบ
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
