import { isElement, oneOf } from '@xl-vision/utils';
import getNodeName from './getNodeName';
import getParentNode from './getParentNode';

const getOverflowAncestors = (node: Node): Array<Element> => {
  const list: Array<Element> = [];

  const scrollableAncestor = getNearestOverflowAncestor(node);

  if (scrollableAncestor && scrollableAncestor !== scrollableAncestor.ownerDocument.body) {
    list.push(scrollableAncestor);
    list.push(...getOverflowAncestors(scrollableAncestor));
  }

  return list;
};

export default getOverflowAncestors;

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
