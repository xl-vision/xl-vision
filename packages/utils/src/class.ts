export const getClasses = (element: Element) => {
  const classes = (element.className || '').trim();
  return classes.split(/\s+/);
};

export const containClass = (element: Element, className: string) => {
  return getClasses(element).some((it) => it === className);
};

export const addClass = (element: Element, className: string) => {
  if (containClass(element, className)) {
    return;
  }
  const _className = `${element.className} ${className}`;
  element.className = _className.replace(/\s+/, ' ').trim();
};

export const removeClass = (element: Element, className: string) => {
  if (!containClass(element, className)) {
    return;
  }
  const _className = element.className.replace(className, ' ');
  element.className = _className.replace(/\s+/, ' ').trim();
};
