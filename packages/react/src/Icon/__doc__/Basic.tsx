import React from 'react';
import { Icon, Row } from '@xl-vision/react';
import DeleteFilled from '@xl-vision/icons/DeleteFilled';
import DeleteRound from '@xl-vision/icons/DeleteRound';
import DeleteSharp from '@xl-vision/icons/DeleteSharp';
import DeleteTwotone from '@xl-vision/icons/DeleteTwotone';
import DeleteOutlined from '@xl-vision/icons/DeleteOutlined';
import DeleteForeverFilled from '@xl-vision/icons/DeleteForeverFilled';
import DeleteForeverRound from '@xl-vision/icons/DeleteForeverRound';
import DeleteForeverSharp from '@xl-vision/icons/DeleteForeverSharp';
import DeleteForeverTwotone from '@xl-vision/icons/DeleteForeverTwotone';
import DeleteForeverOutlined from '@xl-vision/icons/DeleteForeverOutlined';

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
