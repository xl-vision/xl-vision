import { fireEvent, render } from '@testing-library/react';
import { SizeVariant, ThemeProvider, Textarea } from '@xl-vision/react';

describe('Textarea', () => {
  it('test component size', () => {
    const componentSizeVariants: Array<SizeVariant> = ['small', 'middle', 'large'];

    const { container, rerender } = render(
      <ThemeProvider>
        <Textarea />
      </ThemeProvider>,
    );

    componentSizeVariants.forEach((componentSize) => {
      rerender(
        <ThemeProvider sizeVariant={componentSize}>
          <Textarea />
        </ThemeProvider>,
      );

      expect(container.querySelector(`.xl-textarea--size-${componentSize}`)).not.toBe(null);
    });
  });

  it('test disabled state', () => {
    const { container, rerender } = render(<Textarea />);

    const el = container.querySelector('textarea')!;

    fireEvent.focus(el);

    expect(container.querySelector('.xl-textarea--focused')).not.toBeNull();
    expect(container.querySelector('.xl-textarea--disabled')).toBeNull();

    rerender(<Textarea disabled={true} />);

    expect(container.querySelector('.xl-textarea--disabled')).not.toBeNull();
    expect(container.querySelector('.xl-textarea--focused')).toBeNull();
  });

  it('test default value', () => {
    const msg = 'msg';

    const { container } = render(<Textarea defaultValue={msg} />);

    const el = container.querySelector('textarea')!;

    expect(el.value).toBe(msg);

    const newMsg = 'new msg';

    fireEvent.change(el, { target: { value: newMsg } });

    expect(el.value).toBe(newMsg);
  });

  it('test controlled and uncontrolled state', () => {
    const msg = 'msg';

    const { container, rerender } = render(<Textarea />);

    const el = container.querySelector('textarea')!;

    fireEvent.change(el, { target: { value: msg } });

    expect(el.value).toBe(msg);

    const newMsg = 'new msg';

    rerender(<Textarea value={newMsg} />);

    fireEvent.change(el, { target: { value: msg } });

    expect(el.value).toBe(newMsg);
  });
});
