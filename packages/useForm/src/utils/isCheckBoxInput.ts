const isCheckBoxInput = (element: unknown): boolean =>
  element instanceof HTMLInputElement && element.type === 'checkbox';
export default isCheckBoxInput;
