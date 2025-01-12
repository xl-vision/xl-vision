const isCheckBoxInput = (element: unknown): element is HTMLInputElement =>
  element instanceof HTMLInputElement && element.type === 'checkbox';
export default isCheckBoxInput;
