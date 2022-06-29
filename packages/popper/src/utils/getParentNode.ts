import { getDocumentElement, isShadowRoot } from '@xl-vision/utils';
import getNodeName from './getNodeName';

export default (node: Node): Node => {
  if (getNodeName(node) === 'html') {
    return node;
  }

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (node.assignedSlot as Node) ||
    node.parentNode ||
    (isShadowRoot(node) && node.host) ||
    getDocumentElement(node)
  );
};
