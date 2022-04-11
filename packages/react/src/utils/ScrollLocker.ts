import { getDocumentElement, warning } from '@xl-vision/utils';
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

  locked: boolean;

  constructor(options: ScrollLockerOptions) {
    this.options = options;
    this.locked = false;
  }

  private getContainer() {
    return this.options.getContainer?.() || document.body;
  }

  lock() {
    if (this.locked) {
      warning(true, `<ScrollLocker>: is locked already, please do not lock again.`);
      return;
    }
    this.locked = true;

    const container = this.getContainer();

    const detail = locks.get(container);

    if (detail) {
      detail.count++;
      return;
    }

    let scrollbarSize = 0;

    if (
      container === document.body &&
      window.innerWidth - getDocumentElement(container).clientWidth > 0
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
    if (!this.locked) {
      warning(true, `<ScrollLocker>: is unlocked already, please do not unlock again.`);
      return;
    }
    this.locked = false;

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
