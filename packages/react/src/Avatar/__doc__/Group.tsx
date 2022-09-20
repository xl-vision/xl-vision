import { DesktopOutlined, UserOutlined } from '@xl-vision/icons';
import { Avatar, Tooltip } from '@xl-vision/react';

const Group = () => {
  return (
    <>
      <Avatar.Group>
        <Avatar src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' />
        <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
        <Tooltip content='Ant User' placement='top'>
          <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
        </Tooltip>
        <Avatar style={{ backgroundColor: '#1890ff' }} icon={<DesktopOutlined />} />
      </Avatar.Group>
      <Avatar.Group
        maxCount={2}
        shape='round'
        maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
      >
        <Avatar src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' />
        <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
        <Tooltip content='Ant User' placement='top'>
          <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
        </Tooltip>
        <Avatar style={{ backgroundColor: '#1890ff' }} icon={<DesktopOutlined />} />
      </Avatar.Group>
      <Avatar.Group
        maxCount={2}
        size='large'
        maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
      >
        <Avatar src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' />
        <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
        <Tooltip content='Ant User' placement='top'>
          <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
        </Tooltip>
        <Avatar style={{ backgroundColor: '#1890ff' }} icon={<DesktopOutlined />} />
      </Avatar.Group>
    </>
  );
};

export default Group;
