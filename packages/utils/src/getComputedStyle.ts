import { getWindow } from './window';

const getComputedStyle = (el: Element, pseudoElt?: string | null) => {
  return getWindow(el).getComputedStyle(el, pseudoElt);
};
export default getComputedStyle;
