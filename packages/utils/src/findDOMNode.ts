/* eslint-disable unicorn/filename-case */
import { ReactInstance } from 'react';
import ReactDOM from 'react-dom';
import { isElement } from './dom';
import { isReact19 } from './reactVersion';
import warning from './warning';

const findDOMNode = <T = Element | Text>(
  node: ReactInstance | Element | null | undefined,
): T | null => {
  if (!node || isElement(node)) {
    return node as T;
  }
  if (!isReact19) {
    // @ts-expect-error findDOMNode is deprecated
    // eslint-disable-next-line react/no-find-dom-node
    return ReactDOM.findDOMNode(node) as unknown as T;
  }

  warning(true, 'Could not find DOM node for target %s', String(node));

  return null;
};

export default findDOMNode;
