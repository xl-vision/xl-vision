import { mount } from 'enzyme';
import { Portal } from '@xl-vision/react';

describe('Portal', () => {
  it('test mount on body', () => {
    mount(
      <div>
        <Portal container={() => document.body}>
          <div>123</div>
        </Portal>
      </div>,
    );

    expect(document.body).toMatchSnapshot();
  });

  it('test mount on current position', () => {
    const wrapper = mount(
      <div>
        <Portal container={null}>
          <div>123</div>
        </Portal>
      </div>,
    );
    expect(wrapper.render()).toMatchSnapshot();
  });
});
