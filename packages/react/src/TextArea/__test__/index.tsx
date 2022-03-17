import { TextArea, ThemeProvider } from '@xl-vision/react';
import { mount } from 'enzyme';
import React from 'react';

describe('TextArea', () => {
  it('test component size', () => {
    const componentSizes = ['small', 'middle', 'large'];

    const wrapper = mount(
      <ThemeProvider>
        <TextArea />
      </ThemeProvider>,
    );

    componentSizes.forEach((componentSize) => {
      wrapper.setProps({
        theme: { componentSize },
      });
      expect(wrapper.find(`.xl-textarea--size-${componentSize}`)).not.toBe(null);
    });
  });
});
