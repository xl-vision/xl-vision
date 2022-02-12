import React from 'react';
import { mount } from 'enzyme';
import { DeleteFilled } from '../src';

describe('Icon', () => {
  it('test render', () => {
    const wrapper = mount(<DeleteFilled />);

    expect(wrapper.render()).toMatchSnapshot();
  });

  it('test ref', () => {
    const fn = jest.fn();
    mount(<DeleteFilled ref={fn} />);

    expect((fn.mock.calls[0] as Array<any>)[0]).toBeInstanceOf(SVGSVGElement);
  });
});
