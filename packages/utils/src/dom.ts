import { getWindow } from './window';

export const contains = (parent: Element, child: Element | null) => {
  if (parent.contains) {
    return parent.contains(child);
  }
  let temp: Element | null = child;
  while (temp) {
    if (temp === parent) {
      return true;
    }
    temp = temp.parentElement;
  }
  return false;
};

declare global {
  interface Window {
    HTMLElement: any;
    Element: any;
    Node: any;
    ShadowRoot: any;
    Document: any;
  }
}

export const isNode = (value: unknown): value is Node => {
  if (typeof value !== 'object') {
    return false;
  }
  return (value as Node).nodeType > 0 && value instanceof getWindow(value as Node).Node;
};

export const isHTMLElement = (value: unknown): value is HTMLElement => {
  return isNode(value) && value instanceof getWindow(value).HTMLElement;
};

export const isElement = (value: unknown): value is Element => {
  return isNode(value) && value instanceof getWindow(value).Element;
};

export const isShadowRoot = (value: unknown): value is ShadowRoot => {
  return isNode(value) && value instanceof getWindow(value).ShadowRoot;
};

export const isDocument = (value: unknown): value is Document => {
  return isNode(value) && value instanceof getWindow(value).Document;
};
