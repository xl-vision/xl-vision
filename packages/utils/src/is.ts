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

export const isHTMLElement = (value: Node): value is HTMLElement => {
  return value instanceof getWindow(value).HTMLElement;
};

export const isElement = (value: Node): value is Element => {
  return value instanceof getWindow(value).Element;
};

export const isShadowRoot = (value: Node): value is ShadowRoot => {
  return value instanceof getWindow(value).ShadowRoot;
};

export const isNode = (value: unknown): value is Node => {
  if (typeof value !== 'object') {
    return false;
  }
  return (value as Node).nodeType > 0 && value instanceof getWindow(value as Node).Node;
};

export const isDocument = (value: Node): value is Document => {
  return value instanceof getWindow(value).Document;
};

export const isWindow = (obj: unknown): obj is Window => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return obj !== null && obj !== undefined && obj === (obj as any).window;
};
