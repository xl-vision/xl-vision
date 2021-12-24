import { DesktopOutlined, UserOutlined } from '@xl-vision/icons';
import { Avatar, Icon, Tooltip } from '@xl-vision/react';
import React from 'react';

const Group = () => {
  return (
    <>
      <Avatar.Group>
        <Avatar src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' />
        <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
        <Tooltip content='Ant User' placement='top'>
          <Avatar
            style={{ backgroundColor: '#87d068' }}
            icon={
              <Icon>
                <UserOutlined />
              </Icon>
            }
          />
        </Tooltip>
        <Avatar
          style={{ backgroundColor: '#1890ff' }}
          icon={
            <Icon>
              <DesktopOutlined />
            </Icon>
          }
        />
      </Avatar.Group>
      <Avatar.Group
        maxCount={2}
        shape='round'
        maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
      >
        <Avatar src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' />
        <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
        <Tooltip content='Ant User' placement='top'>
          <Avatar
            style={{ backgroundColor: '#87d068' }}
            icon={
              <Icon>
                <UserOutlined />
              </Icon>
            }
          />
        </Tooltip>
        <Avatar
          style={{ backgroundColor: '#1890ff' }}
          icon={
            <Icon>
              <DesktopOutlined />
            </Icon>
          }
        />
      </Avatar.Group>
      <Avatar.Group
        maxCount={2}
        size='large'
        maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
      >
        <Avatar src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' />
        <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
        <Tooltip content='Ant User' placement='top'>
          <Avatar
            style={{ backgroundColor: '#87d068' }}
            icon={
              <Icon>
                <UserOutlined />
              </Icon>
            }
          />
        </Tooltip>
        <Avatar
          style={{ backgroundColor: '#1890ff' }}
          icon={
            <Icon>
              <DesktopOutlined />
            </Icon>
          }
        />
      </Avatar.Group>
    </>
  );
};

export default Group;
