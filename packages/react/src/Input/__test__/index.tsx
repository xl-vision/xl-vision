import React from 'react';
import { mount } from 'enzyme';
import { ThemeProvider, Input, Button } from '@xl-vision/react';

describe('Input', () => {
  it.todo('test onChange event');

  it('test component size', () => {
    const componentSizes = ['small', 'middle', 'large'];

    const wrapper = mount(
      <ThemeProvider>
        <Input />
      </ThemeProvider>,
    );

    componentSizes.forEach((componentSize) => {
      wrapper.setProps({
        theme: { componentSize },
      });
      expect(wrapper.find(`.xl-input--size-${componentSize}`)).not.toBe(null);
    });
  });
});

describe('InputGroup', () => {
  it('test size', () => {
    const componentSizes = ['small', 'middle', 'large'];

    const wrapper = mount(
      <Input.Group>
        <Button>button</Button>
        <Input />
      </Input.Group>,
    );

    componentSizes.forEach((componentSize) => {
      wrapper.setProps({
        size: componentSize,
      });
      expect(wrapper.find(`.xl-input--size-${componentSize}`)).not.toBe(null);
      expect(wrapper.find(`.xl-button--size-${componentSize}`)).not.toBe(null);
    });
  });
});
