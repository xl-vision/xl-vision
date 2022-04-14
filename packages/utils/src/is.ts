import { getWindow } from './window';

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
