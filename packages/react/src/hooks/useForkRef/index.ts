import React from 'react';

export default <T>(ref1: React.Ref<T>, ref2: React.Ref<T>): React.Ref<T> => {
  return React.useMemo(() => {
    return (value: T | null) => {
      setRef(ref1, value);
      setRef(ref2, value);
    };
  }, [ref1, ref2]);
};

const setRef = <T>(ref: React.Ref<T>, value: T | null) => {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref) {
    (ref.current as any) = value;
  }
};
