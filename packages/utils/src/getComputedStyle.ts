import getWindow from './getWindow';

export default (el: Element, pseudoElt?: string | null) => {
  return getWindow(el).getComputedStyle(el, pseudoElt);
};
