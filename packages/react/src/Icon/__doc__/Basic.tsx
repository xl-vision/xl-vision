import React from 'react';
import { Icon, Row } from '@xl-vision/react';
import {
  DeleteFilled,
  DeleteRound,
  DeleteSharp,
  DeleteTwotone,
  DeleteOutlined,
  DeleteForeverFilled,
  DeleteForeverRound,
  DeleteForeverSharp,
  DeleteForeverTwotone,
  DeleteForeverOutlined,
} from '@xl-vision/icons';

export default () => {
  return (
    <div>
      <Row>
        <Row.Col column={8}>Filled</Row.Col>
        <Row.Col column={16}>
          <Icon>
            <DeleteFilled />
          </Icon>
          <Icon>
            <DeleteForeverFilled />
          </Icon>
        </Row.Col>
      </Row>
      <Row>
        <Row.Col column={8}>Outlined</Row.Col>
        <Row.Col column={16}>
          <Icon>
            <DeleteOutlined />
          </Icon>
          <Icon>
            <DeleteForeverOutlined />
          </Icon>
        </Row.Col>
      </Row>
      <Row>
        <Row.Col column={8}>Rounded</Row.Col>
        <Row.Col column={16}>
          <Icon>
            <DeleteRound />
          </Icon>
          <Icon>
            <DeleteForeverRound />
          </Icon>
        </Row.Col>
      </Row>
      <Row>
        <Row.Col column={8}>Two Tone</Row.Col>
        <Row.Col column={16}>
          <Icon>
            <DeleteTwotone />
          </Icon>
          <Icon>
            <DeleteForeverTwotone />
          </Icon>
        </Row.Col>
      </Row>
      <Row>
        <Row.Col column={8}>Sharp</Row.Col>
        <Row.Col column={16}>
          <Icon>
            <DeleteSharp />
          </Icon>
          <Icon>
            <DeleteForeverSharp />
          </Icon>
        </Row.Col>
      </Row>
    </div>
  );
};
