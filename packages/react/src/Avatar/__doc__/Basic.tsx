import React from 'react';
import { Avatar, Icon } from '@xl-vision/react';
import { UserOutlined } from '@xl-vision/icons';

export default () => {
  return (
    <div>
      <Avatar
        icon={
          <Icon>
            <UserOutlined />
          </Icon>
        }
      />
    </div>
  );
};
