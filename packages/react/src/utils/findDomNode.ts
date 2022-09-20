import { ReactInstance } from 'react';
import ReactDOM from 'react-dom';

const findDomNode = <T = Element | null | Text>(
  node: ReactInstance | Element | null | undefined,
): T => {
  // eslint-disable-next-line react/no-find-dom-node
  return ReactDOM.findDOMNode(node) as unknown as T;
};

export default findDomNode;
