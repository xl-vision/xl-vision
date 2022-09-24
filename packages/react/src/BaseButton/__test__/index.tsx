import { mount } from 'enzyme';
import { BaseButton } from '@xl-vision/react';

describe('BaseButton', () => {
  it('basic test', () => {
    const handleClick = jest.fn();

    const wrapper = mount(<BaseButton onClick={handleClick}>button</BaseButton>);

    wrapper.find(BaseButton).simulate('click');

    expect(handleClick.mock.calls.length).toBe(1);

    expect(wrapper.render()).toMatchSnapshot();
  });

  it('测试disabled', () => {
    const handleClick = jest.fn();

    const wrapper = mount(
      <BaseButton disabled={true} onClick={handleClick}>
        button
      </BaseButton>,
    );

    wrapper.find(BaseButton).simulate('click');
    wrapper.update();

    expect(handleClick.mock.calls.length).toBe(0);
  });

  it('测试loading', () => {
    const handleClick = jest.fn();

    const wrapper = mount(
      <BaseButton loading={true} onClick={handleClick}>
        button
      </BaseButton>,
    );

    wrapper.find(BaseButton).simulate('click');
    wrapper.update();

    expect(handleClick.mock.calls.length).toBe(0);
  });
});
