import { getWindow } from './window';

export default (el: Element, pseudoElt?: string | null) => {
  return getWindow(el).getComputedStyle(el, pseudoElt);
};
