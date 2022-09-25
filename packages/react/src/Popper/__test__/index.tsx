import { Popper } from '@xl-vision/react';
import { act, fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Popper', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it('test trigger hover', () => {
    const handleVisibleChange = jest.fn();

    const { container } = render(
      <Popper
        trigger='hover'
        popup={<div>popup</div>}
        onVisibleChange={handleVisibleChange}
        popupContainer={() => document.body}
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
        trigger='click'
        popup={<div>popup</div>}
        onVisibleChange={handleVisibleChange}
        popupContainer={() => document.body}
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
        trigger='contextMenu'
        popup={<div>popup</div>}
        onVisibleChange={handleVisibleChange}
        popupContainer={() => document.body}
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
        trigger='focus'
        popup={<div>popup</div>}
        onVisibleChange={handleVisibleChange}
        popupContainer={() => document.body}
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
        trigger={false}
        popup={<div id='popup'>popup</div>}
        onVisibleChange={handleVisibleChange}
        popupContainer={() => document.body}
        visible={false}
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
        trigger={false}
        popup={<div id='popup'>popup</div>}
        onVisibleChange={handleVisibleChange}
        popupContainer={() => document.body}
        visible={true}
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
        trigger={false}
        popup={<div id='popup'>popup</div>}
        onVisibleChange={handleVisibleChange}
        popupContainer={() => document.body}
        visible={false}
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
        trigger='hover'
        className='popup'
        popup={<div>popup</div>}
        onVisibleChange={handleVisibleChange}
        popupContainer={() => document.body}
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
        trigger='hover'
        className='popup'
        popup={<div>popup</div>}
        onVisibleChange={handleVisibleChange}
        popupContainer={() => document.body}
        hoverOptions={{ disablePopperEnter: true }}
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
        trigger='hover'
        id='popup'
        popup={<div>popup</div>}
        popupContainer={() => document.body}
        mountOnShow={false}
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
        trigger='hover'
        id='popup'
        popup={<div>popup</div>}
        popupContainer={() => document.body}
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
