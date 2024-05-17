'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Avatar, Space , Skeleton } from 'antd';
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

  if (isLoading || !user) {
    return (
      <div className="bg-white shadow-lg w-full">
        <Skeleton active />
      </div>
    );
  }

  const handleLogoutClick = () => {
    signOut({ redirect: true, callbackUrl: '/' });
  };

  const handleSettingsClick = () => {
    router.push('/settings');
  };

  if (isLoading || !user) {
    return (
      <div className="bg-white shadow-lg w-full">
      </div>
    );
  }

  return (
    <div className="w-full">
      <nav className="p-6">
        <div className="bg-amber-300 shadow-xl w-full p-3 flex items-center justify-between rounded-lg">
          <div className="flex items-center">
            <div className="ml-3">
              <div className="text-xl text-black">Professor Portfolio - แฟ้มรวมผลงานอาจารย์</div>
            </div>
          </div>
          <div className="flex items-center">
            <div>
              <div className="text-black">{`${user.rank.rankname} ${user.prefix} ${user.username} ${user.lastname}`}</div>
              <div className="text-right text-black">{user.email}</div>
            </div>
            <div className="ml-4">
              <div onClick={() => setDropdownOpen(!isDropdownOpen)} className="cursor-pointer">
                {user.user_image ? (
                  <Space wrap size={16}>
                    <Avatar
                      size={50}
                      src={user.user_image || '/image/none_image.png'}
                      icon={!user.user_image && <UserOutlined />}
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
                <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-10">
                  <button
                    onClick={handleSettingsClick}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white"
                  >
                    Settings
                  </button>
                  <button
                    onClick={handleLogoutClick}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white"
                  >
                    Sign out
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
