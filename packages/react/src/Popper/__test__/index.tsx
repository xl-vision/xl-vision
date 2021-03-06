import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import Popper from '..';
import wait from '../../../../../test/wait';

describe('Popper', () => {
  beforeAll(() => {
    jest.useRealTimers();
  });

  it('test trigger hover', async () => {
    const handleVisibleChange = jest.fn();

    const wrapper = mount(
      <Popper
        trigger='hover'
        popup={<div>popup</div>}
        onVisibleChange={handleVisibleChange}
        getPopupContainer={() => document.body}
      >
        <button id='btn'>button</button>
      </Popper>,
    );

    expect(wrapper.render()).toMatchSnapshot();

    wrapper.find('#btn').simulate('mouseenter');

    await act(() => wait(200));

    expect(handleVisibleChange).toHaveBeenLastCalledWith(true);
    expect(wrapper.render()).toMatchSnapshot();

    wrapper.find('#btn').simulate('mouseleave');

    await act(() => wait(200));

    expect(handleVisibleChange).toHaveBeenLastCalledWith(false);
    expect(wrapper.render()).toMatchSnapshot();
  });
  it('test trigger click', async () => {
    const handleVisibleChange = jest.fn();

    const wrapper = mount(
      <Popper
        trigger='click'
        popup={<div>popup</div>}
        onVisibleChange={handleVisibleChange}
        getPopupContainer={() => document.body}
      >
        <button id='btn'>button</button>
      </Popper>,
    );

    expect(wrapper.render()).toMatchSnapshot();

    wrapper.find('#btn').simulate('click');

    await act(() => wait(200));

    expect(handleVisibleChange).toHaveBeenLastCalledWith(true);
    expect(wrapper.render()).toMatchSnapshot();

    document.body.click();

    await act(() => wait(200));

    expect(handleVisibleChange).toHaveBeenLastCalledWith(false);
    expect(wrapper.render()).toMatchSnapshot();
  });
  it('test trigger contextMenu', async () => {
    const handleVisibleChange = jest.fn();

    const wrapper = mount(
      <Popper
        trigger='contextMenu'
        popup={<div>popup</div>}
        onVisibleChange={handleVisibleChange}
        getPopupContainer={() => document.body}
      >
        <button id='btn'>button</button>
      </Popper>,
    );

    expect(wrapper.render()).toMatchSnapshot();

    wrapper.find('#btn').simulate('contextMenu');

    await act(() => wait(200));

    expect(handleVisibleChange).toHaveBeenLastCalledWith(true);
    expect(wrapper.render()).toMatchSnapshot();

    document.body.click();

    await act(() => wait(200));

    expect(handleVisibleChange).toHaveBeenLastCalledWith(false);
    expect(wrapper.render()).toMatchSnapshot();
  });
  it('test trigger custom', async () => {
    const handleVisibleChange = jest.fn();

    const wrapper = mount(
      <Popper
        trigger='custom'
        popup={<div>popup</div>}
        onVisibleChange={handleVisibleChange}
        getPopupContainer={() => document.body}
      >
        <button id='btn'>button</button>
      </Popper>,
    );
    expect(handleVisibleChange.mock.calls.length).toBe(1);
    expect(handleVisibleChange).toHaveBeenLastCalledWith(false);

    expect(wrapper.render()).toMatchSnapshot();

    wrapper.find('#btn').simulate('mouseenter');

    await act(() => wait(200));

    expect(handleVisibleChange.mock.calls.length).toBe(1);

    wrapper.setProps({
      visible: true,
    });

    await act(() => wait(200));

    expect(handleVisibleChange).toHaveBeenLastCalledWith(true);
    expect(wrapper.render()).toMatchSnapshot();

    wrapper.setProps({
      visible: false,
    });
    await act(() => wait(200));

    expect(handleVisibleChange).toHaveBeenLastCalledWith(false);
    expect(wrapper.render()).toMatchSnapshot();
  });
  it('test prop disablePopupEnter', async () => {
    const handleVisibleChange = jest.fn();
    const wrapper = mount(
      <Popper
        trigger='hover'
        popupClassName='popup'
        popup={<div>popup</div>}
        onVisibleChange={handleVisibleChange}
        getPopupContainer={() => document.body}
      >
        <button id='btn'>button</button>
      </Popper>,
    );

    wrapper.find('#btn').simulate('mouseenter');

    await act(() => wait(200));
    expect(handleVisibleChange).toHaveBeenLastCalledWith(true);

    wrapper.find('#btn').simulate('mouseleave');
    wrapper.find('.popup').simulate('mouseenter');

    await act(() => wait(200));
    expect(handleVisibleChange).toHaveBeenLastCalledWith(true);

    wrapper.find('.popup').simulate('mouseleave');
    await act(() => wait(200));
    expect(handleVisibleChange).toHaveBeenLastCalledWith(false);

    wrapper.setProps({
      disablePopupEnter: true,
    });

    wrapper.find('#btn').simulate('mouseenter');

    await act(() => wait(200));
    expect(handleVisibleChange).toHaveBeenLastCalledWith(true);

    wrapper.find('#btn').simulate('mouseleave');
    wrapper.find('.popup').simulate('mouseenter');

    await act(() => wait(200));
    expect(handleVisibleChange).toHaveBeenLastCalledWith(false);
  });
});
