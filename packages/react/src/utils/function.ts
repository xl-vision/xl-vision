export const functionMerge = <Fn extends (...args: Array<unknown>) => unknown>(
  ...fns: Array<Fn>
): ((...args: Parameters<Fn>) => Array<ReturnType<Fn>>) => {
  return (...args: Parameters<Fn>) => {
    return fns.map((it) => it(...args) as ReturnType<Fn>);
  };
};

const defaultCompare = (left: unknown, right: unknown) => Object.is(left, right);

export const shallowEqual = (left: unknown, right: unknown, compare = defaultCompare) => {
  if (compare(left, right)) {
    return true;
  }

  if (typeof left !== 'object' || !left || typeof right !== 'object' || !right) {
    return false;
  }

  const keysLeft = Object.keys(left);
  const keysRight = Object.keys(right);

  if (keysLeft.length !== keysRight.length) {
    return false;
  }

  const rightOwnProperty = Object.prototype.hasOwnProperty.bind(right);

  for (let i = 0; i < keysLeft.length; i++) {
    const key = keysLeft[i];
    if (!rightOwnProperty(key)) {
      return false;
    }
    const leftValue = (left as Record<string, unknown>)[key];
    const rightalue = (right as Record<string, unknown>)[key];

    if (!compare(leftValue, rightalue)) {
      return false;
    }
  }

  return true;
};
