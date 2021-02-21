import React from 'react';
import { mount } from 'enzyme';
import DeleteFilled from '@xl-vision/icons/DeleteFilled';
import Icon from '..';

describe('Icon', () => {
  it('test render', () => {
    const wrapper = mount(
      <Icon>
        <DeleteFilled />
      </Icon>,
    );

    expect(wrapper.render()).toMatchSnapshot();
  });

  it('test ref', () => {
    const fn = jest.fn();
    mount(
      <Icon ref={fn}>
        <DeleteFilled />
      </Icon>,
    );

    expect((fn.mock.calls[0] as Array<any>)[0]).toBeInstanceOf(SVGSVGElement);
  });
});
