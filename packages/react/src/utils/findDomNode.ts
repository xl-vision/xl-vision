import ReactDOM from 'react-dom';

const findDomNode = <T = Element | null | Text>(
  node: React.ReactInstance | HTMLElement | null | undefined,
): T => {
  if (node instanceof HTMLElement) {
    return node as unknown as T;
  }
  // eslint-disable-next-line react/no-find-dom-node
  return ReactDOM.findDOMNode(node) as unknown as T;
};

export default findDomNode;
