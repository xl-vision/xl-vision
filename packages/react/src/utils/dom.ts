// eslint-disable-next-line import/prefer-default-export
export const include = (parent: Element, child: Element) => {
  let temp: Element | null = child;
  while (temp) {
    if (temp === parent) {
      return true;
    }
    temp = temp.parentElement;
  }
  return false;
};
