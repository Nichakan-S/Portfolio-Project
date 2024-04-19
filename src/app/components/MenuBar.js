'use client'
import React from 'react';
import Link from 'next/link'; 
import { Menu } from 'antd';
function getItem(label, key, icon, children, type) {
    return { key, icon, children, label, type };
  }

const items = [
    getItem(
        <Link href="/users/academic">
            Academic
        </Link>
    ),
    getItem(
        <Link href="/users/activity">
            Activity
        </Link>
    ),
    getItem(
        <Link href="/users/research">
            Research
        </Link>
    ),
    getItem(
        <Link href="/src/app/users/overview">
            Overview
        </Link>
    ),
    ];

const Menubar = () => {
  const onClick = (e) => {
    console.log('click ', e);
  };
  return (
    <Menu
      onClick={onClick}
      style={{
        width: '15rem',
        height: '100vh',
        backgroundColor: '#ffffff',
        color: 'black',
        padding: '1rem',
      }}
      defaultSelectedKeys={['1']}
      defaultOpenKeys={['sub1']}
      mode="inline"
      items={items}
    />
  );
};
export default Menubar;