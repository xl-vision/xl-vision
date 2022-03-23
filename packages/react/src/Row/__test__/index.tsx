import { render } from 'enzyme';
import * as React from 'react';
import { Row } from '@xl-vision/react';

describe('Row', () => {
  it('基本用法', () => {
    const wrapper = render(
      <div>
        <div className='box'>
          <Row gutter={10}>
            <Row.Col column={4}>
              <div className='col'>col1</div>
            </Row.Col>
            <Row.Col column={5}>
              <div className='col'>col2</div>
            </Row.Col>
            <Row.Col column={7}>
              <div className='col'>col3</div>
            </Row.Col>
            <Row.Col column={8}>
              <div className='col'>col4</div>
            </Row.Col>
          </Row>
        </div>
        <div className='box'>
          <Row gutter={10}>
            <Row.Col column={6}>
              <div className='col'>col1</div>
            </Row.Col>
            <Row.Col column={6}>
              <div className='col'>col2</div>
            </Row.Col>
            <Row.Col column={6}>
              <div className='col'>col3</div>
            </Row.Col>
            <Row.Col column={6}>
              <div className='col'>col4</div>
            </Row.Col>
          </Row>
        </div>
        <div className='box'>
          <Row gutter={10}>
            <Row.Col column={8}>
              <div className='col'>col1</div>
            </Row.Col>
            <Row.Col column={0}>
              <div className='col'>col2</div>
            </Row.Col>
            <Row.Col column={8}>
              <div className='col'>col3</div>
            </Row.Col>
            <Row.Col column={8}>
              <div className='col'>col4</div>
            </Row.Col>
          </Row>
        </div>
      </div>,
    );
    expect(wrapper).toMatchSnapshot();
    // wrapper.unmount()
  });
  it('偏移布局', () => {
    const wrapper = render(
      <div>
        <div className='box'>
          <Row gutter={10}>
            <Row.Col column={6}>
              <div className='col'>col1</div>
            </Row.Col>
            <Row.Col column={6} offset={6}>
              <div className='col'>col2</div>
            </Row.Col>
            <Row.Col column={6}>
              <div className='col'>col3</div>
            </Row.Col>
          </Row>
        </div>
        <div className='box'>
          <Row gutter={10}>
            <Row.Col column={6}>
              <div className='col'>col1</div>
            </Row.Col>
            <Row.Col column={6} push={6}>
              <div className='col'>col2</div>
            </Row.Col>
            <Row.Col column={6} pull={6}>
              <div className='col'>col3</div>
            </Row.Col>
            <Row.Col column={6}>
              <div className='col'>col4</div>
            </Row.Col>
          </Row>
        </div>
        <div className='box'>
          <Row gutter={10}>
            <Row.Col column={6} offset={6}>
              <div className='col'>col1</div>
            </Row.Col>
            <Row.Col column={6} pull={12}>
              <div className='col'>col2</div>
            </Row.Col>
            <Row.Col column={6}>
              <div className='col'>col4</div>
            </Row.Col>
          </Row>
        </div>
      </div>,
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('响应式布局', () => {
    const wrapper = render(
      <div className='box'>
        <Row gutter={{ xs: 8, sm: 10, md: 15, lg: 20, xl: 25, xxl: 30 }}>
          <Row.Col column={{ xs: 8, sm: 6, md: 4, lg: 6 }}>
            <div className='col'>col1</div>
          </Row.Col>
          <Row.Col column={{ xs: 8, sm: 6, md: 5, lg: 10, xxl: 6 }}>
            <div className='col'>col2</div>
          </Row.Col>
          <Row.Col column={{ xs: 8, sm: 6, md: 7, lg: 4, xl: 0, xxl: 6 }}>
            <div className='col'>col3</div>
          </Row.Col>
          <Row.Col column={{ xs: 0, sm: 6, md: 8, lg: 4, xl: 8, xxl: 6 }}>
            <div className='col'>col4</div>
          </Row.Col>
        </Row>
      </div>,
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('响应式偏移', () => {
    const wrapper = render(
      <div>
        <div className='box'>
          <Row gutter={10}>
            <Row.Col column={6}>
              <div className='col'>col1</div>
            </Row.Col>
            <Row.Col column={6} offset={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }}>
              <div className='col'>col2</div>
            </Row.Col>
            <Row.Col column={6}>
              <div className='col'>col3</div>
            </Row.Col>
          </Row>
        </div>
        <div className='box'>
          <Row gutter={10}>
            <Row.Col column={6}>
              <div className='col'>col1</div>
            </Row.Col>
            <Row.Col column={6}>
              <div className='col'>col2</div>
            </Row.Col>
            <Row.Col column={6} push={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }}>
              <div className='col'>col3</div>
            </Row.Col>
          </Row>
        </div>
        <div className='box'>
          <Row gutter={10}>
            <Row.Col column={6}>
              <div className='col'>col1</div>
            </Row.Col>
            <Row.Col column={6}>
              <div className='col'>col2</div>
            </Row.Col>
            <Row.Col column={6} pull={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }} offset={6}>
              <div className='col'>col3</div>
            </Row.Col>
          </Row>
        </div>
      </div>,
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('自定义标签', () => {
    const wrapper = render(
      <Row component='header'>
        <Row.Col column={5}>hello</Row.Col>
      </Row>,
    );

    expect(wrapper.is('header')).toBe(true);
  });
});
