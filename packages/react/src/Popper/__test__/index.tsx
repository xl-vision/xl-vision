import { act, fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Popper } from '@xl-vision/react';

describe('Popper', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it('test trigger hover', () => {
    const handleVisibleChange = jest.fn();

    const { container } = render(
      <Popper
        popup={<div>popup</div>}
        popupContainer={() => document.body}
        trigger='hover'
        onVisibleChange={handleVisibleChange}
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

    expect(handleVisibleChange).toHaveBeenLastCalledWith(true);

    expect(document.body).toMatchSnapshot();

    fireEvent.mouseLeave(btn);

    act(() => {
      jest.runAllTimers();
    });

    expect(handleVisibleChange).toHaveBeenLastCalledWith(false);

    expect(document.body).toMatchSnapshot();
  });
  it('test trigger click', async () => {
    const handleVisibleChange = jest.fn();

    const { container } = render(
      <Popper
        popup={<div>popup</div>}
        popupContainer={() => document.body}
        trigger='click'
        onVisibleChange={handleVisibleChange}
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

    expect(handleVisibleChange).toHaveBeenLastCalledWith(true);
    expect(document.body).toMatchSnapshot();

    document.body.click();

    act(() => {
      jest.runAllTimers();
    });

    expect(handleVisibleChange).toHaveBeenLastCalledWith(false);
    expect(document.body).toMatchSnapshot();
  });
  it('test trigger contextMenu', () => {
    const handleVisibleChange = jest.fn();

    const { container } = render(
      <Popper
        popup={<div>popup</div>}
        popupContainer={() => document.body}
        trigger='contextMenu'
        onVisibleChange={handleVisibleChange}
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

    expect(handleVisibleChange).toHaveBeenLastCalledWith(true);
    expect(document.body).toMatchSnapshot();

    document.body.click();

    act(() => {
      jest.runAllTimers();
    });

    expect(handleVisibleChange).toHaveBeenLastCalledWith(false);
    expect(document.body).toMatchSnapshot();
  });
  it('test trigger focus', () => {
    const handleVisibleChange = jest.fn();

    const { container } = render(
      <Popper
        popup={<div>popup</div>}
        popupContainer={() => document.body}
        trigger='focus'
        onVisibleChange={handleVisibleChange}
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

    expect(handleVisibleChange).toHaveBeenLastCalledWith(true);
    expect(document.body).toMatchSnapshot();

    fireEvent.blur(btn);

    act(() => {
      jest.runAllTimers();
    });

    expect(handleVisibleChange).toHaveBeenLastCalledWith(false);
    expect(document.body).toMatchSnapshot();
  });
  it('test trigger custom', () => {
    // 外部修改不触发visibleChange
    const handleVisibleChange = jest.fn();

    const { container, rerender } = render(
      <Popper
        popup={<div id='popup'>popup</div>}
        popupContainer={() => document.body}
        trigger={false}
        visible={false}
        onVisibleChange={handleVisibleChange}
      >
        <button id='btn'>button</button>
      </Popper>,
    );
    expect(handleVisibleChange.mock.calls.length).toBe(0);
    expect(document.querySelector('#popup')).toBeNull();

    const btn = container.querySelector('#btn')!;

    fireEvent.mouseEnter(btn);

    act(() => {
      jest.runAllTimers();
    });

    expect(handleVisibleChange.mock.calls.length).toBe(0);
    expect(document.querySelector('#popup')).toBeNull();

    rerender(
      <Popper
        popup={<div id='popup'>popup</div>}
        popupContainer={() => document.body}
        trigger={false}
        visible={true}
        onVisibleChange={handleVisibleChange}
      >
        <button id='btn'>button</button>
      </Popper>,
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(handleVisibleChange.mock.calls.length).toBe(0);
    let el = document.querySelector('#popup')!.parentElement!;
    expect(el).not.toBeNull();
    expect(el.style.display).toBe('');

    rerender(
      <Popper
        popup={<div id='popup'>popup</div>}
        popupContainer={() => document.body}
        trigger={false}
        visible={false}
        onVisibleChange={handleVisibleChange}
      >
        <button id='btn'>button</button>
      </Popper>,
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(handleVisibleChange.mock.calls.length).toBe(0);
    el = document.querySelector('#popup')!.parentElement!;
    expect(el).not.toBeNull();
    expect(el.style.display).toBe('none');
  });
  it('test disablePopupEnter', () => {
    const handleVisibleChange = jest.fn();
    const { container, rerender } = render(
      <Popper
        className='popup'
        popup={<div>popup</div>}
        popupContainer={() => document.body}
        trigger='hover'
        onVisibleChange={handleVisibleChange}
      >
        <button id='btn'>button</button>
      </Popper>,
    );

    const btn = container.querySelector('#btn')!;

    fireEvent.mouseEnter(btn);

    act(() => {
      jest.runAllTimers();
    });

    expect(handleVisibleChange).toHaveBeenLastCalledWith(true);

    fireEvent.mouseLeave(btn);

    const popup = document.querySelector('div.popup')!;

    fireEvent.mouseEnter(popup);

    act(() => {
      jest.runAllTimers();
    });

    expect(handleVisibleChange).toHaveBeenLastCalledWith(true);

    fireEvent.mouseLeave(popup);

    act(() => {
      jest.runAllTimers();
    });

    expect(handleVisibleChange).toHaveBeenLastCalledWith(false);

    rerender(
      <Popper
        className='popup'
        hoverOptions={{ disablePopperEnter: true }}
        popup={<div>popup</div>}
        popupContainer={() => document.body}
        trigger='hover'
        onVisibleChange={handleVisibleChange}
      >
        <button id='btn'>button</button>
      </Popper>,
    );

    fireEvent.mouseEnter(btn);

    act(() => {
      jest.runAllTimers();
    });

    expect(handleVisibleChange).toHaveBeenLastCalledWith(true);

    fireEvent.mouseLeave(btn);
    fireEvent.mouseEnter(popup);

    act(() => {
      jest.runAllTimers();
    });
    expect(handleVisibleChange).toHaveBeenLastCalledWith(false);
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

  it('test unmountOnHide', () => {
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

    act(() => {
      jest.runAllTimers();
    });

    let el = document.querySelector('#popup');

    expect(el).toBe(null);

    const btn = container.querySelector('#btn')!;

    fireEvent.mouseEnter(btn);

    act(() => {
      jest.runAllTimers();
    });

    fireEvent.mouseLeave(btn);

    act(() => {
      jest.runAllTimers();
    });

    el = document.querySelector('#popup');
    expect(el).toBe(null);
  });
});
