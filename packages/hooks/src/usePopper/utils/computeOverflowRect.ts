import {
  contains,
  getBoundingClientRect,
  getComputedStyle,
  getDocumentElement,
  getWindow,
  isElement,
  isHTMLElement,
  oneOf,
} from '@xl-vision/utils';
import { MiddlewareParameter, OverflowOptions, OverflowRect, Rect, RootBoundary } from '../types';
import getNodeName from './getNodeName';
import getParentNode from './getParentNode';

export type Options = OverflowOptions & {
  ctx: MiddlewareParameter;
  target?: 'reference' | 'popper';
};

export default ({
  boundary = 'clippingAncestors',
  rootBoundary = 'viewport',
  padding = 0,
  target = 'popper',
  ctx,
}: Options): OverflowRect => {
  const { reference, popper, popperRect, x, y, referenceRect, side, alignment } = ctx;

  const element = isElement(reference)
    ? reference
    : reference.elementContext || getDocumentElement(popper);

  const ancestors: Array<Element | RootBoundary> =
    boundary === 'clippingAncestors'
      ? getFiltedOverflowAncestors(element)
      : Array.isArray(boundary)
      ? boundary
      : [boundary];

  ancestors.push(rootBoundary);

  const win = getWindow(element);

  const clipRect = ancestors
    .map((it) => {
      if (it === 'viewport') {
        const vv = win.visualViewport;
        return {
          left: vv.offsetLeft,
          top: vv.offsetTop,
          right: vv.width + vv.offsetLeft,
          bottom: vv.height + vv.offsetTop,
        };
      }
      const { left, top } = getBoundingClientRect(it as Element);

      const innerLeft = left + (it as Element).clientLeft;
      const innerTop = top + (it as Element).clientTop;

      return {
        left: innerLeft,
        top: innerTop,
        bottom: innerTop + (it as Element).clientHeight,
        right: innerLeft + (it as Element).clientWidth,
      };
    })
    .reduce((accRect, rect) => {
      const left = Math.max(accRect.left, rect.left);
      const right = Math.min(accRect.right, rect.right);
      const top = Math.max(accRect.top, rect.top);
      const bottom = Math.min(accRect.bottom, rect.bottom);
      return {
        left,
        right,
        top,
        bottom,
      };
    });

  padding = typeof padding === 'function' ? padding({ side, alignment }) : padding;

  const paddingObject =
    typeof padding === 'number'
      ? { left: padding, top: padding, right: padding, bottom: padding }
      : { left: 0, top: 0, right: 0, bottom: 0, ...padding };

  const rect: Rect =
    target === 'reference'
      ? referenceRect
      : {
          ...popperRect,
          x: referenceRect.x + x,
          y: referenceRect.y + y,
        };

  return {
    left: clipRect.left + paddingObject.left - rect.x,
    top: clipRect.top + paddingObject.top - rect.y,
    bottom: rect.y + rect.height - clipRect.bottom + paddingObject.bottom,
    right: rect.x + rect.width - clipRect.right + paddingObject.right,
  };
};

const getFiltedOverflowAncestors = (element: Element): Array<Element> => {
  const ancestors = getOverflowAncestors(element);

  const canSkip = oneOf(['absolue', 'fixed'], getComputedStyle(element).position);

  if (!canSkip || !isHTMLElement(element)) {
    return ancestors;
  }

  const { offsetParent } = element;

  return ancestors.filter((it) => contains(it, offsetParent));
};

const getOverflowAncestors = (node: Node): Array<Element> => {
  const list: Array<Element> = [];

  const scrollableAncestor = getNearestOverflowAncestor(node);

  if (scrollableAncestor && scrollableAncestor !== scrollableAncestor.ownerDocument.body) {
    list.push(scrollableAncestor);
    list.push(...getOverflowAncestors(scrollableAncestor));
  }

  return list;
};

const getNearestOverflowAncestor = (node: Node): Element | null => {
  const parentNode = getParentNode(node);
  if (oneOf(['html', 'body', '#document'], getNodeName(parentNode))) {
    const body = node.ownerDocument?.body;
    if (body && isOverflowElement(body)) {
      return body;
    }
    return null;
  }
  if (isElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }

  return getNearestOverflowAncestor(parentNode);
};

const isOverflowElement = (element: Element) => {
  const { overflow, overflowX, overflowY } = getComputedStyle(element);
  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
};
