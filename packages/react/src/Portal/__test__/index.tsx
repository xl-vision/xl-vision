import { mount } from 'enzyme';
import React from 'react';
import Portal from '..';

describe('Portal', () => {
  it('test mount on body', () => {
    const wrapper = mount(
      <div>
        <Portal getContainer={() => document.body}>
          <div>123</div>
        </Portal>
      </div>,
    );

    expect(wrapper.render()).toMatchSnapshot();
  });

  it('test mount on current position', () => {
    const wrapper = mount(
      <div>
        <Portal getContainer={null}>
          <div>123</div>
        </Portal>
      </div>,
    );
    expect(wrapper.render()).toMatchSnapshot();
  });
});
