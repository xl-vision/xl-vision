import { getWindow } from './window';

const getDocumentElement = (node?: Node): HTMLElement => {
  return ((node && node.ownerDocument) || getWindow(node).document).documentElement;
};
export default getDocumentElement;
