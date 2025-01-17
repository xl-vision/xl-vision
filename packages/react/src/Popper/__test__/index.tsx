import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { triggerTransitionEnd } from 'test/utils';
import { Popper } from '@xl-vision/react';

describe('Popper', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it('test trigger hover', () => {
    const handleOpenChange = jest.fn();

    const { container } = render(
      <Popper
        popup={<div>popup</div>}
        popupContainer={() => document.body}
        trigger='hover'
        onOpenChange={handleOpenChange}
      >
        <button id='btn'>button</button>
      </Popper>,
    );

    expect(document.body).toMatchSnapshot();

    const btn = container.querySelector('#btn')!;

    fireEvent.mouseEnter(btn);

    act(() => {
      jest.runAllTimers();
    });

    expect(handleOpenChange).toHaveBeenLastCalledWith(true);

    expect(document.body).toMatchSnapshot();

    fireEvent.mouseLeave(btn);

    act(() => {
      jest.runAllTimers();
    });

    expect(handleOpenChange).toHaveBeenLastCalledWith(false);

    expect(document.body).toMatchSnapshot();
  });
  it('test trigger click', async () => {
    const handleOpenChange = jest.fn();

    const { container } = render(
      <Popper
        popup={<div>popup</div>}
        popupContainer={() => document.body}
        trigger='click'
        onOpenChange={handleOpenChange}
      >
        <button id='btn'>button</button>
      </Popper>,
    );

    expect(document.body).toMatchSnapshot();

    const btn = container.querySelector('#btn')!;

    const user = userEvent.setup({ delay: null });

    await user.click(btn);

    act(() => {
      jest.runAllTimers();
    });

    expect(handleOpenChange).toHaveBeenLastCalledWith(true);
    expect(document.body).toMatchSnapshot();

    document.body.click();

    act(() => {
      jest.runAllTimers();
    });

    expect(handleOpenChange).toHaveBeenLastCalledWith(false);
    expect(document.body).toMatchSnapshot();
  });
  it('test trigger contextMenu', () => {
    const handleOpenChange = jest.fn();

    const { container } = render(
      <Popper
        popup={<div>popup</div>}
        popupContainer={() => document.body}
        trigger='contextMenu'
        onOpenChange={handleOpenChange}
      >
        <button id='btn'>button</button>
      </Popper>,
    );

    expect(document.body).toMatchSnapshot();

    const btn = container.querySelector('#btn')!;

    fireEvent.contextMenu(btn);

    act(() => {
      jest.runAllTimers();
    });

    expect(handleOpenChange).toHaveBeenLastCalledWith(true);
    expect(document.body).toMatchSnapshot();

    document.body.click();

    act(() => {
      jest.runAllTimers();
    });

    expect(handleOpenChange).toHaveBeenLastCalledWith(false);
    expect(document.body).toMatchSnapshot();
  });
  it('test trigger focus', () => {
    const handleOpenChange = jest.fn();

    const { container } = render(
      <Popper
        popup={<div>popup</div>}
        popupContainer={() => document.body}
        trigger='focus'
        onOpenChange={handleOpenChange}
      >
        <button id='btn'>button</button>
      </Popper>,
    );

    expect(document.body).toMatchSnapshot();

    const btn = container.querySelector('#btn')!;

    fireEvent.focus(btn);

    act(() => {
      jest.runAllTimers();
    });

    expect(handleOpenChange).toHaveBeenLastCalledWith(true);
    expect(document.body).toMatchSnapshot();

    fireEvent.blur(btn);

    act(() => {
      jest.runAllTimers();
    });

    expect(handleOpenChange).toHaveBeenLastCalledWith(false);
    expect(document.body).toMatchSnapshot();
  });
  it('test trigger custom', async () => {
    // 外部修改不触发onOpenChange
    const handleOpenChange = jest.fn();

    const { container, rerender } = render(
      <Popper
        open={false}
        popup={<div id='popup'>popup</div>}
        popupContainer={() => document.body}
        trigger={false}
        onOpenChange={handleOpenChange}
      >
        <button id='btn'>button</button>
      </Popper>,
    );
    expect(handleOpenChange.mock.calls.length).toBe(0);
    expect(document.querySelector('#popup')).toBeNull();

    const btn = container.querySelector('#btn')!;

    fireEvent.mouseEnter(btn);

    await triggerTransitionEnd();

    expect(handleOpenChange.mock.calls.length).toBe(0);
    expect(document.querySelector('#popup')).toBeNull();

    rerender(
      <Popper
        open={true}
        popup={<div id='popup'>popup</div>}
        popupContainer={() => document.body}
        trigger={false}
        onOpenChange={handleOpenChange}
      >
        <button id='btn'>button</button>
      </Popper>,
    );

    await triggerTransitionEnd();

    expect(handleOpenChange.mock.calls.length).toBe(0);
    let el = document.querySelector('#popup')!.parentElement!;
    expect(el).not.toBeNull();
    expect(el.style.display).toBe('');

    rerender(
      <Popper
        open={false}
        popup={<div id='popup'>popup</div>}
        popupContainer={() => document.body}
        trigger={false}
        onOpenChange={handleOpenChange}
      >
        <button id='btn'>button</button>
      </Popper>,
    );

    await triggerTransitionEnd();

    expect(handleOpenChange.mock.calls.length).toBe(0);

    el = document.querySelector('#popup')!.parentElement!;

    expect(el).not.toBeNull();

    expect(el.style.display).toBe('none');
  });
  it('test disablePopupEnter', async () => {
    const handleOpenChange = jest.fn();
    const { container, rerender } = render(
      <Popper
        className='popup'
        popup={<div>popup</div>}
        popupContainer={() => document.body}
        trigger='hover'
        onOpenChange={handleOpenChange}
      >
        <button id='btn'>button</button>
      </Popper>,
    );

    const btn = container.querySelector('#btn')!;

    fireEvent.mouseEnter(btn);

    await triggerTransitionEnd();

    expect(handleOpenChange).toHaveBeenLastCalledWith(true);

    fireEvent.mouseLeave(btn);

    const popup = document.querySelector('div.popup')!;

    fireEvent.mouseEnter(popup);

    await triggerTransitionEnd();

    expect(handleOpenChange).toHaveBeenLastCalledWith(true);

    fireEvent.mouseLeave(popup);

    await triggerTransitionEnd();

    expect(handleOpenChange).toHaveBeenLastCalledWith(false);

    rerender(
      <Popper
        className='popup'
        hoverOptions={{ disablePopperEnter: true }}
        popup={<div>popup</div>}
        popupContainer={() => document.body}
        trigger='hover'
        onOpenChange={handleOpenChange}
      >
        <button id='btn'>button</button>
      </Popper>,
    );

    fireEvent.mouseEnter(btn);

    await triggerTransitionEnd();

    expect(handleOpenChange).toHaveBeenLastCalledWith(true);

    fireEvent.mouseLeave(btn);
    fireEvent.mouseEnter(popup);

    await triggerTransitionEnd();

    expect(handleOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('test mountOnShow', () => {
    const { container } = render(
      <Popper
        id='popup'
        mountOnShow={false}
        popup={<div>popup</div>}
        popupContainer={() => document.body}
        trigger='hover'
      >
        <button id='btn'>button</button>
      </Popper>,
    );

    act(() => {
      jest.runAllTimers();
    });

    let el = document.querySelector('#popup');

    expect(el).not.toBe(null);

    const btn = container.querySelector('#btn')!;

    fireEvent.mouseEnter(btn);

    act(() => {
      jest.runAllTimers();
    });

    el = document.querySelector('#popup');
    expect(el).not.toBe(null);
  });

  it('test unmountOnHide', async () => {
    const { container } = render(
      <Popper
        id='popup'
        popup={<div>popup</div>}
        popupContainer={() => document.body}
        trigger='hover'
        unmountOnHide={true}
      >
        <button id='btn'>button</button>
      </Popper>,
    );

    await triggerTransitionEnd();

    let el = document.querySelector('#popup');

    expect(el).toBe(null);

    const btn = container.querySelector('#btn')!;

    fireEvent.mouseEnter(btn);

    await triggerTransitionEnd();

    el = document.querySelector('#popup');
    expect(el).not.toBe(null);

    fireEvent.mouseLeave(btn);

    await triggerTransitionEnd();
    jest.runAllTimers();

    el = document.querySelector('#popup');
    expect(el).toBe(null);
  });
});
