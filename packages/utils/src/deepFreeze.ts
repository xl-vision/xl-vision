const deepFreeze = (value: any) => {
  if (value === null) {
    return;
  }

  if (typeof value !== 'object') {
    return;
  }

  Object.freeze(value);

  if (Array.isArray(value)) {
    value.forEach(deepFreeze);
    return;
  }

  Object.keys(value as Record<PropertyKey, any>).forEach((key) => {
    deepFreeze((value as Record<PropertyKey, any>)[key as PropertyKey]);
  });
};

export default deepFreeze;
