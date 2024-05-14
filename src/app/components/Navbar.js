'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import { Avatar, Space, Col, Row} from 'antd';
import { UserOutlined } from '@ant-design/icons';

const Navbar = ({ isAdmin }) => {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const hide = () => {
    setOpen(false);
  };
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };


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
    router.push('/settings');
  };

  if (isLoading || !user) {
    return (
      <div className=" bg-white shadow-lg flex flex-col w-full">
        <nav className="p-3">
          <Row justify="space-around" align="middle" >
            <Col span={1} className="flex items-center justify-center">
            </Col>
            <Col span={15} className="text-left">
              <div style={{ display: 'flex', flexDirection: 'column' }}>
              </div>
            </Col>

            <Col span={8} className="text-right" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', height: '100%' }}>
              <div>
              </div>
              <div className="flex items-center relative ml-4">
                
              </div>
            </Col>
          </Row>
        </nav>
      </div>
    );
  }

  return (
    <div className=" bg-white shadow-lg flex flex-col w-full">
      <nav className="p-3">
        <Row justify="space-around" align="middle" >
          <Col span={1} className="flex items-center justify-center">
            <Image
              src="/image/Newchandralogo1.png"
              alt="Logo"
              width={50}
              height={50}
              style={{ borderRadius: '50%', width: 'auto', height: 'auto' }} />
          </Col>
          <Col span={15} className="text-left">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Link href={isAdmin ? '/admin' : '/users'} className="text-xl font-bold ml-3" style={{ color: '#6C7AA3' }}>
                Chandrakasem Rajabhat University
              </Link>
              <Link href={isAdmin ? '/admin' : '/users'} className="text-xl font ml-3" style={{ color: '#6C7AA3' }}>
                มหาวิทยาลัยราชภัฏจันทรเกษม
              </Link>
            </div>
          </Col>

          <Col span={8} className="text-right" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', height: '100%' }}>
            <div>
              <div style={{ color: '#6C7AA3' }} >{`${user.rank.rankname} ${user.prefix} ${user.username} ${user.lastname}`}</div>
              <div className="text-right" style={{ color: '#6C7AA3' }} >{user.email}</div>
            </div>
            <div className="flex items-center relative ml-4">
              <div onClick={() => setDropdownOpen(!isDropdownOpen)} className="cursor-pointer">
                {user.user_image ? (
                  <Space wrap size={16}>
                    <Avatar
                      size={50}
                      src={user.user_image || '/image/none_image.png'}
                      icon={!user.user_image && <UserOutlined />}
                      onError={() => {
                        return true;
                      }}
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
                <div className="absolute right-0 top-full mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-10">
                  <button
                    onClick={handleSettingsClick}
                    className="block w-full text-left px-4 py-2 text-sm capitalize text-gray-700 hover:bg-blue-500 hover:text-white rounded-md"
                  >Settings
                  </button>
                  <button
                    onClick={handleLogoutClick}
                    className="block w-full text-left px-4 py-2 text-sm capitalize text-gray-700 hover:bg-blue-500 hover:text-white rounded-md"
                  >Sign out
                  </button>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </nav>
    </div>
  );
};

export default Navbar;
