import getScrollbarSize from './getScrollbarSize';

export type ScrollLockerOptions = {
  getContainer?: () => HTMLElement;
};

const locks = new Map<
  HTMLElement,
  {
    count: number;
    style: {
      overflow: CSSStyleDeclaration['overflow'];
      overflowX: CSSStyleDeclaration['overflowX'];
      overflowY: CSSStyleDeclaration['overflowY'];
      width: CSSStyleDeclaration['width'];
    };
  }
>();

export default class ScrollLocker {
  private options: ScrollLockerOptions;

  constructor(options: ScrollLockerOptions) {
    this.options = options;
  }

  private getContainer() {
    return this.options.getContainer?.() || document.body;
  }

  lock() {
    const container = this.getContainer();

    const detail = locks.get(container);
    if (detail) {
      detail.count++;
      return;
    }

    let scrollbarSize = 0;

    if (
      (container === document.body &&
        window.innerWidth - document.documentElement.clientWidth > 0) ||
      container.scrollHeight > container.clientHeight
    ) {
      scrollbarSize = getScrollbarSize();
    }

    const { overflow, overflowX, overflowY, width } = container.style;

    locks.set(container, {
      count: 1,
      style: {
        overflow,
        overflowX,
        overflowY,
        width,
      },
    });
    container.style.overflow = 'hidden';
    container.style.overflowX = 'hidden';
    container.style.overflowY = 'hidden';
    container.style.width = `calc(100% - ${scrollbarSize}px)`;
  }

  unlock() {
    const container = this.getContainer();

    const detail = locks.get(container);
    if (!detail) {
      return;
    }

    const { count, style } = detail;
    if (count > 1) {
      detail.count--;
      return;
    }

    container.style.overflow = style.overflow;
    container.style.overflowX = style.overflowX;
    container.style.overflowX = style.overflowX;
    container.style.width = style.width;

    locks.delete(container);
  }
}
