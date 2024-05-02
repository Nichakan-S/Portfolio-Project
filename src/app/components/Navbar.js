'use client'

import { useEffect,useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';

const Navbar = ({ isAdmin }) => {
  const { data: session, status  } = useSession();
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
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-between bg-white shadow-md p-4">
      <div className="flex items-center">
        <Image
          src="/image/Newchandralogo1.png"
          alt="Logo"
          width={40}
          height={40}
          style={{ borderRadius: '50%', width: 'auto', height: 'auto' }} />
        <Link href={isAdmin ? '/admin' : '/users'} className="text-xl font-bold ml-3">Chandrakasem Rajabhat University</Link>
        <Link href={isAdmin ? '/admin' : '/users'} className="text-xl font ml-3">มหาวิทยาลัยราชภัฏจันทรเกษม</Link>
      </div>
      <div className="flex items-center">
        <div>
          <div>{`${user.rank.rankname} ${user.prefix} ${user.username} ${user.lastname}`}</div>
          <div className="text-right">{user.email}</div>
        </div>
        <div className="flex items-center relative ml-4">
          <div onClick={() => setDropdownOpen(!isDropdownOpen)} className="cursor-pointer">
            {user.user_image ? (
              <Image
                src={user.user_image}
                alt="User profile image"
                width={40}
                height={40}
                className="rounded-full"
                onLoad={() => {}}
                onError={(e) => { e.target.onerror = null; e.target.src='/image/none_image.png'; }}
              />
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
      </div>
    </div>
  );
};

export default Navbar;
