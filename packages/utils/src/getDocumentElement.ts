import getWindow from './getWindow';

export default (node: Node): HTMLElement => {
  return (node.ownerDocument || getWindow(node).document).documentElement;
};
