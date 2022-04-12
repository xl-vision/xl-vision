import {
  contains,
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
  padding: number | Partial<{ top: number; right: number; left: number; bottom: number }>;
};

export default ({ boundary, rootBoundary, element, padding }: Options) => {
  const ancestors: Array<Element | RootBoundary> =
    boundary === 'clippingAncestors' ? getFiltedOverflowAncestors(element) : [].concat(boundary);

  ancestors.push(rootBoundary);

  const win = getWindow(element);

  ancestors.reduce((rect, ancestor) => {
    let nextRect: Rect;
    if (ancestor === 'viewport') {
      const vv = win.visualViewport;
      nextRect = {
        x: vv.offsetLeft,
        y: vv.offsetTop,
        width: vv.width,
        height: vv.height,
      };
    } else {
    }
  });
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
