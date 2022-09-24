import { mount } from 'enzyme';
import { ThemeProvider, Input, Button } from '@xl-vision/react';

describe('Input', () => {
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

  it('test disabled state', () => {
    const wrapper = mount(<Input />);

    wrapper.find('input').simulate('focus');

    expect(wrapper.find('.xl-input--focused').exists()).toBe(true);
    expect(wrapper.find('.xl-input--disabled').exists()).toBe(false);

    wrapper
      .setProps({
        disabled: true,
      })
      .update();

    expect(wrapper.find('.xl-input--disabled').exists()).toBe(true);
    expect(wrapper.find('.xl-input--focused').exists()).toBe(false);
  });

  it('test default value', () => {
    const msg = 'msg';

    const wrapper = mount(<Input defaultValue={msg} />);

    const input = wrapper.find('input');

    expect(input.getDOMNode<HTMLInputElement>().value).toBe(msg);

    const newMsg = 'new msg';

    input.simulate('change', { target: { value: newMsg } });
    expect(input.getDOMNode<HTMLInputElement>().value).toBe(newMsg);
  });

  it('test controlled and uncontrolled state', () => {
    const msg = 'msg';

    const wrapper = mount(<Input />);

    const input = wrapper.find('input');

    input.simulate('change', { target: { value: msg } });

    expect(input.getDOMNode<HTMLInputElement>().value).toBe(msg);

    const newMsg = 'new msg';

    wrapper.setProps({ value: newMsg });

    input.simulate('change', { target: { value: msg } });

    expect(input.getDOMNode<HTMLInputElement>().value).toBe(newMsg);
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
