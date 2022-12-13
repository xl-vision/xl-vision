export default (element: unknown): element is HTMLInputElement =>
  element instanceof HTMLInputElement && element.type === 'checkbox';
