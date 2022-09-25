import { Avatar } from '@xl-vision/react';
import { render, fireEvent } from '@testing-library/react';

describe('Avatar', () => {
  it('Render string', () => {
    const { container } = render(<Avatar>TestString</Avatar>);
    const el = container.querySelector('.xl-avatar__inner')!;
    expect(el.textContent).toBe('TestString');
  });

  it('Render fallback string', () => {
    const { container } = render(<Avatar src='http://error.url'>Fallback</Avatar>);

    const img = container.querySelector('img')!;

    fireEvent.error(img);

    expect(container.querySelectorAll('img').length).toBe(0);

    const el = container.querySelector('span.xl-avatar__inner')!;

    expect(el.textContent).toBe('Fallback');
  });

  it('Custom onError function', () => {
    const { container, rerender } = render(
      <Avatar src='http://error.url' onError={() => false}>
        Fallback
      </Avatar>,
    );

    const img = container.querySelector('img')!;

    fireEvent.error(img);

    expect(container.querySelectorAll('img').length).toBe(1);

    expect(container.querySelectorAll('span.xl-avatar__inner').length).toBe(0);

    rerender(
      <Avatar src='http://error.url' onError={() => true}>
        Fallback
      </Avatar>,
    );

    fireEvent.error(img);

    expect(container.querySelectorAll('img').length).toBe(0);

    expect(container.querySelector('span.xl-avatar__inner')!.textContent).toBe('Fallback');
  });
});

describe('AvatarGroup', () => {
  it('render size', () => {
    const { container } = render(
      <Avatar.Group size='large'>
        <Avatar>TestString</Avatar>
        <Avatar>TestString</Avatar>
      </Avatar.Group>,
    );

    expect(container.querySelectorAll('span.xl-avatar--size-large').length).toBe(2);
  });

  it('render shape', () => {
    const { container } = render(
      <Avatar.Group shape='square'>
        <Avatar>TestString</Avatar>
        <Avatar>TestString</Avatar>
      </Avatar.Group>,
    );

    expect(container.querySelectorAll('span.xl-avatar--shape-square').length).toBe(2);
  });
});
