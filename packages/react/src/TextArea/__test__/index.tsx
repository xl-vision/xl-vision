import { TextArea, ThemeProvider } from '@xl-vision/react';
import { mount } from 'enzyme';

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

  it('test disabled state', () => {
    const wrapper = mount(<TextArea />);

    wrapper.find('textarea').simulate('focus');

    expect(wrapper.find('.xl-textarea--focused').exists()).toBe(true);
    expect(wrapper.find('.xl-textarea--disabled').exists()).toBe(false);

    wrapper
      .setProps({
        disabled: true,
      })
      .update();

    expect(wrapper.find('.xl-textarea--disabled').exists()).toBe(true);
    expect(wrapper.find('.xl-textarea--focused').exists()).toBe(false);
  });

  it('test default value', () => {
    const msg = 'msg';

    const wrapper = mount(<TextArea defaultValue={msg} />);

    const input = wrapper.find('textarea');

    expect(input.getDOMNode<HTMLTextAreaElement>().value).toBe(msg);

    const newMsg = 'new msg';

    input.simulate('change', { target: { value: newMsg } });
    expect(input.getDOMNode<HTMLTextAreaElement>().value).toBe(newMsg);
  });

  it('test controlled and uncontrolled state', () => {
    const msg = 'msg';

    const wrapper = mount(<TextArea />);

    const input = wrapper.find('textarea');

    input.simulate('change', { target: { value: msg } });

    expect(input.getDOMNode<HTMLTextAreaElement>().value).toBe(msg);

    const newMsg = 'new msg';

    wrapper.setProps({ value: newMsg });

    input.simulate('change', { target: { value: msg } });

    expect(input.getDOMNode<HTMLTextAreaElement>().value).toBe(newMsg);
  });
});
