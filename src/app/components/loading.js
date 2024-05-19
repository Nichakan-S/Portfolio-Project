import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export default function Loading() {
    const antIcon = (
        <LoadingOutlined style={{ fontSize: 48, color: '#facc15' }} spin />
    );
    
    return (
        <div 
            style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh', // ทำให้คอนเทนเนอร์มีความสูงเท่ากับหน้าจอ
            width: '100%'  // ทำให้คอนเทนเนอร์มีความกว้างเท่ากับหน้าจอ
        }}>
            <Spin indicator={antIcon} />
        </div>
    );
}
