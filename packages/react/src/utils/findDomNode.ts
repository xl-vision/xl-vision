import ReactDOM from 'react-dom';
import { isElement } from 'react-is';

const findDomNode = <T = Element | null | Text>(
  node: React.ReactInstance | Element | null | undefined,
): T => {
  if (isElement(node)) {
    return node as unknown as T;
  }
  // eslint-disable-next-line react/no-find-dom-node
  return ReactDOM.findDOMNode(node) as unknown as T;
};

export default findDomNode;
