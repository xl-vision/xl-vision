import { BaseButton } from '@xl-vision/react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('BaseButton', () => {
  it('Test basic render', () => {
    const { container } = render(
      <>
        <BaseButton>button</BaseButton>
        <BaseButton disabled={true}>button</BaseButton>
        <BaseButton loading={true}>button</BaseButton>
      </>,
    );

    expect(container).toMatchSnapshot();
  });

  it('Test onClick event', async () => {
    const handleClick = jest.fn();

    const { container } = render(<BaseButton onClick={handleClick}>button</BaseButton>);

    const el = container.querySelector('button')!;

    const user = userEvent.setup();

    await user.click(el);

    expect(handleClick.mock.calls.length).toBe(1);
  });

  it('Test disable state', async () => {
    const handleClick = jest.fn();

    const { container } = render(
      <BaseButton disabled={true} onClick={handleClick}>
        button
      </BaseButton>,
    );

    const el = container.querySelector('button')!;

    const user = userEvent.setup();

    await user.click(el);

    expect(handleClick.mock.calls.length).toBe(0);
  });

  it('Test loading state', async () => {
    const handleClick = jest.fn();

    const { container } = render(
      <BaseButton loading={true} onClick={handleClick}>
        button
      </BaseButton>,
    );

    const el = container.querySelector('button')!;

    const user = userEvent.setup();

    await user.click(el);

    expect(handleClick.mock.calls.length).toBe(0);
  });
});
