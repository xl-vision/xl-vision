import { isWindow } from './is';

/**
 * Get the window associated with the node
 * @see https://stackoverflow.com/a/23615539
 * @param node
 * @returns
 */
export default (node?: Node | Window): Window => {
  if (!node) {
    return window;
  }

  if (isWindow(node)) {
    return node;
  }

  const { ownerDocument } = node;

  return ownerDocument ? ownerDocument.defaultView || window : window;
};
