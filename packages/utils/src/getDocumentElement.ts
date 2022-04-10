import { getWindow } from './window';

export default (node: Node): HTMLElement => {
  return (node.ownerDocument || getWindow(node).document).documentElement;
};
