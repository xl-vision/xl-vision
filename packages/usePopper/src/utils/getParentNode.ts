import { getDocumentElement, isShadowRoot } from '@xl-vision/utils';
import getNodeName from './getNodeName';

const getParentNode = (node: Node): Node => {
  if (getNodeName(node) === 'html') {
    return node;
  }

  return (
    (node as { assignedSlot?: Node }).assignedSlot ||
    node.parentNode ||
    (isShadowRoot(node) && node.host) ||
    getDocumentElement(node)
  );
};
export default getParentNode;
