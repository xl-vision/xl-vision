export const getClasses = (element: HTMLElement) => {
  const classes = (element.className || '').trim();
  return classes.split(/\s+/);
};

export const containClass = (element: HTMLElement, className: string) => {
  return getClasses(element).some((it) => it === className);
};

export const addClass = (element: HTMLElement, className: string) => {
  if (containClass(element, className)) {
    return;
  }
  const _className = `${element.className} ${className}`;
  element.className = _className.replace(/\s+/, ' ').trim();
};

export const removeClass = (element: HTMLElement, className: string) => {
  if (!containClass(element, className)) {
    return;
  }
  const _className = element.className.replace(className, ' ');
  element.className = _className.replace(/\s+/, ' ').trim();
};
