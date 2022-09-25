import { fireEvent, render } from '@testing-library/react';
import { ComponentSize, TextArea, ThemeProvider } from '@xl-vision/react';

describe('TextArea', () => {
  it('test component size', () => {
    const componentSizes: Array<ComponentSize> = ['small', 'middle', 'large'];

    const { container, rerender } = render(
      <ThemeProvider>
        <TextArea />
      </ThemeProvider>,
    );

    componentSizes.forEach((componentSize) => {
      rerender(
        <ThemeProvider theme={{ componentSize }}>
          <TextArea />
        </ThemeProvider>,
      );

      expect(container.querySelector(`.xl-textarea--size-${componentSize}`)).not.toBe(null);
    });
  });

  it('test disabled state', () => {
    const { container, rerender } = render(<TextArea />);

    const el = container.querySelector('textarea')!;

    fireEvent.focus(el);

    expect(container.querySelector('.xl-textarea--focused')).not.toBeNull();
    expect(container.querySelector('.xl-textarea--disabled')).toBeNull();

    rerender(<TextArea disabled={true} />);

    expect(container.querySelector('.xl-textarea--disabled')).not.toBeNull();
    expect(container.querySelector('.xl-textarea--focused')).toBeNull();
  });

  it('test default value', () => {
    const msg = 'msg';

    const { container } = render(<TextArea defaultValue={msg} />);

    const el = container.querySelector('textarea')!;

    expect(el.value).toBe(msg);

    const newMsg = 'new msg';

    fireEvent.change(el, { target: { value: newMsg } });

    expect(el.value).toBe(newMsg);
  });

  it('test controlled and uncontrolled state', () => {
    const msg = 'msg';

    const { container, rerender } = render(<TextArea />);

    const el = container.querySelector('textarea')!;

    fireEvent.change(el, { target: { value: msg } });

    expect(el.value).toBe(msg);

    const newMsg = 'new msg';

    rerender(<TextArea value={newMsg} />);

    fireEvent.change(el, { target: { value: msg } });

    expect(el.value).toBe(newMsg);
  });
});
