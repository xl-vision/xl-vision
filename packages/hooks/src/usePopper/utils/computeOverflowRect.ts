import {
  contains,
  getBoundingClientRect,
  getComputedStyle,
  getWindow,
  isElement,
  isHTMLElement,
  oneOf,
} from '@xl-vision/utils';
import { Boundary, Rect, RootBoundary } from '../types';
import getNodeName from './getNodeName';
import getParentNode from './getParentNode';

export type Options = {
  boundary: Boundary;
  rootBoundary: RootBoundary;
  element: Element;
  elementRect: Rect;
  padding: number | Partial<{ top: number; right: number; left: number; bottom: number }>;
};

export default ({ boundary, rootBoundary, element, padding, elementRect }: Options) => {
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
      return getBoundingClientRect(it as Element);
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

  const paddingObject =
    typeof padding === 'number'
      ? { left: padding, top: padding, right: padding, bottom: padding }
      : { left: 0, top: 0, right: 0, bottom: 0, ...padding };

  const { x, y, width, height } = elementRect;

  return {
    left: clipRect.left + paddingObject.left - x,
    top: clipRect.top + paddingObject.top - y,
    bottom: y + height - clipRect.bottom + paddingObject.bottom,
    right: x + width - clipRect.right + paddingObject.right,
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

  if (scrollableAncestor) {
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
