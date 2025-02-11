import { ReactInstance } from 'react';
import ReactDOM from 'react-dom';
import { isElement } from './dom';
import { isReact19 } from './reactVersion';
import warning from './warning';

const findDomNode = <T = Element | Text>(
  node: ReactInstance | Element | null | undefined,
): T | null => {
  if (!node || isElement(node)) {
    return node as T;
  }
  if (!isReact19) {
    // eslint-disable-next-line react/no-find-dom-node
    return (ReactDOM as unknown as { findDOMNode: (n: typeof node) => T }).findDOMNode(node);
  }

  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  warning(true, 'Could not find DOM node for target %s', String(node));

  return null;
};

export default findDomNode;
