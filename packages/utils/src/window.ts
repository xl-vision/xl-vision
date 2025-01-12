export const isWindow = (obj: unknown): obj is Window => {
  return obj !== null && obj !== undefined && obj === (obj as { window?: Window }).window;
};

/**
 * Get the window associated with the node
 * @see https://stackoverflow.com/a/23615539
 * @param node
 * @returns
 */
export const getWindow = (node?: Node | Window): Window => {
  if (!node) {
    return window;
  }

  if (isWindow(node)) {
    return node;
  }

  const { ownerDocument } = node;

  return ownerDocument
    ? ownerDocument.defaultView || (node as Document).defaultView || window
    : window;
};
