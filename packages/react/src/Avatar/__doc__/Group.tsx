'use client';

import { DesktopOutlined, UserOutlined } from '@xl-vision/icons';
import { Avatar, Tooltip } from '@xl-vision/react';

const Group = () => {
  return (
    <>
      <Avatar.Group>
        <Avatar src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' />
        <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
        <Tooltip content='Ant User' placement='top'>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#87d068' }} />
        </Tooltip>
        <Avatar icon={<DesktopOutlined />} style={{ backgroundColor: '#1890ff' }} />
      </Avatar.Group>
      <Avatar.Group
        maxCount={2}
        maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
        shape='round'
      >
        <Avatar src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' />
        <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
        <Tooltip content='Ant User' placement='top'>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#87d068' }} />
        </Tooltip>
        <Avatar icon={<DesktopOutlined />} style={{ backgroundColor: '#1890ff' }} />
      </Avatar.Group>
      <Avatar.Group
        maxCount={2}
        maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
        size='large'
      >
        <Avatar src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' />
        <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
        <Tooltip content='Ant User' placement='top'>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#87d068' }} />
        </Tooltip>
        <Avatar icon={<DesktopOutlined />} style={{ backgroundColor: '#1890ff' }} />
      </Avatar.Group>
    </>
  );
};

export default Group;
