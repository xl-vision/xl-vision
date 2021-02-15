import React from 'react';
import { Row } from '@xl-vision/react';

export default () => {
  return (
    <div>
      <div className='grid-box'>
        <Row gutter={10}>
          <Row.Col span={4}>
            <div className='col-box'>col1</div>
          </Row.Col>
          <Row.Col span={5}>
            <div className='col-box'>col2</div>
          </Row.Col>
          <Row.Col span={7}>
            <div className='col-box'>col3</div>
          </Row.Col>
          <Row.Col span={8}>
            <div className='col-box'>col4</div>
          </Row.Col>
        </Row>
      </div>
      <div className='grid-box'>
        <Row gutter={10}>
          <Row.Col span={6}>
            <div className='col-box'>col1</div>
          </Row.Col>
          <Row.Col span={6}>
            <div className='col-box'>col2</div>
          </Row.Col>
          <Row.Col span={6}>
            <div className='col-box'>col3</div>
          </Row.Col>
          <Row.Col span={6}>
            <div className='col-box'>col4</div>
          </Row.Col>
        </Row>
      </div>
      <div className='grid-box'>
        <Row gutter={10}>
          <Row.Col span={8}>
            <div className='col-box'>col1</div>
          </Row.Col>
          <Row.Col span={0}>
            <div className='col-box'>col2</div>
          </Row.Col>
          <Row.Col span={8}>
            <div className='col-box'>col3</div>
          </Row.Col>
          <Row.Col span={8}>
            <div className='col-box'>col4</div>
          </Row.Col>
        </Row>
      </div>
    </div>
  );
};
