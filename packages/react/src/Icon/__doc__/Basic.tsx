import React from 'react';
import { Icon, Row } from '@xl-vision/react';
import { DeleteFilled, DeleteTwotone, DeleteOutlined } from '@xl-vision/icons';

export default () => {
  return (
    <div>
      <Row>
        <Row.Col column={8}>Filled</Row.Col>
        <Row.Col column={16}>
          <Icon>
            <DeleteFilled />
          </Icon>
        </Row.Col>
      </Row>
      <Row>
        <Row.Col column={8}>Outlined</Row.Col>
        <Row.Col column={16}>
          <Icon>
            <DeleteOutlined />
          </Icon>
        </Row.Col>
      </Row>
      <Row>
        <Row.Col column={8}>Two Tone</Row.Col>
        <Row.Col column={16}>
          <Icon>
            <DeleteTwotone />
          </Icon>
        </Row.Col>
      </Row>
    </div>
  );
};
