import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { awaitPromise } from 'test/utils';
import { Dropdown } from '@xl-vision/react';

const menus = (
  <>
    <Dropdown.Item id='item1'>item1</Dropdown.Item>
    <Dropdown.Item disabled={true} id='item2'>
      item2
    </Dropdown.Item>
    <Dropdown.Divider />
    <Dropdown.Submenu id='submenu' title={<div id='submenu-title'>submenu</div>}>
      <Dropdown.Item id='item3'>3rd menu item</Dropdown.Item>
      <Dropdown.Item disabled={true} id='item4'>
        4th menu item
      </Dropdown.Item>
    </Dropdown.Submenu>
    <Dropdown.Item>item3</Dropdown.Item>
  </>
);

describe('Dropdown', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it('Test trigger hover', async () => {
    const { container } = render(
      <Dropdown id='popup' menus={menus}>
        <button id='btn'>button</button>
      </Dropdown>,
    );

    await act(async () => {
      await awaitPromise();
      jest.runAllTimers();
    });

    expect(document.querySelector('div#popup')).toBe(null);

    const user = userEvent.setup({ delay: null });

    const btn = container.querySelector('button#btn')!;

    await act(async () => {
      await user.click(btn);
    });

    await act(async () => {
      await awaitPromise();
      jest.runAllTimers();
    });

    expect(document.querySelector('div#popup')!.firstChild as HTMLDivElement).not.toBe(null);
    expect((document.querySelector('div#popup')!.firstChild as HTMLDivElement).style.display).toBe(
      '',
    );

    act(() => {
      (document.querySelector('li#item1') as HTMLLIElement).click();
    });

    await act(async () => {
      await awaitPromise();
      jest.runAllTimers();
    });

    expect((document.querySelector('#popup')!.firstChild as HTMLDivElement).style.display).toBe(
      'none',
    );

    fireEvent.mouseEnter(btn);

    await act(async () => {
      await awaitPromise();
      jest.runAllTimers();
    });

    expect((document.querySelector('#popup')!.firstChild as HTMLDivElement).style.display).toBe('');

    const li = document.querySelector('li#item2')!;

    await act(async () => {
      await user.click(li);
      await awaitPromise();
      jest.runAllTimers();
    });

    expect((document.querySelector('#popup')!.firstChild as HTMLDivElement).style.display).toBe('');
  });
});
