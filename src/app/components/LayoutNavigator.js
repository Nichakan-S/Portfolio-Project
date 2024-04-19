'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { Col, Row , Popover , Avatar, Space , Button} from 'antd';
import { BellFilled  } from '@ant-design/icons';
import Menubar from './MenuBar'

const DemoBox = (props) => <p className={`height-${props.value}`}>{props.children}</p>;
const text = <span>Notification</span>;
const content = (
  <div>
    <p>Example 1</p>
    <p>Example 2</p>
    <p>Example </p>
  </div>
);
const Layout = ({ children }) => {
  const [open, setOpen] = useState(false);
  const hide = () => {
    setOpen(false);
  };
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };
  return (
    <div className="min-h-screen flex flex-col">
        <nav className="text-Black p-4" style={{ backgroundColor: '#fff566' }}>
            <Row justify="space-around" align="middle" >
            <Col span={1}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/0c/Newchandralogo1.png" 
                alt="Chandra Logo" 
                width={55} />
            </Col>
            <Col span={5}>
                <h1 class="university-name">มหาวิทยาลัยราชภัฏจันทรเกษม</h1>
                <p class="university-motto">Chandrakasem Rajabhat University</p>
            </Col>
            <Col span={14}>
            </Col>
            <Col>
            </Col>
            <Col span={1} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Popover
                content={<a onClick={hide}> {content }</a>}
                title= {text}
                trigger="click"
                open={open}
                onOpenChange={handleOpenChange}
                >
                <Button type="primary">
                  <BellFilled style={{ fontSize: '24px' }} />
                </Button>
              </Popover>
            </Col>
            <Col span={1} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Space size={55} wrap>
                    <DemoBox value={90}>
                        <Avatar size={40} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJIwASCJpICHRbFDOQXQ2S-pmikc8vs6K2GA&s" /> 
                    </DemoBox>
                </Space>
            </Col>
            <Col span={2}>
                <h1 class="user-name">fristname Lastname</h1>
            </Col>
            </Row>
            {/* Add other links here */}
        </nav>
      <div className="flex flex-1">
        <aside>
          <Menubar / >
        </aside>
        <main className="flex-1 p-4" style={{ backgroundColor: '#f0f0f0' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
