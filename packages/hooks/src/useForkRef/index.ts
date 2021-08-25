import React from 'react';

export default <T>(...refs: Array<React.Ref<T>>): React.Ref<T> => {
  return React.useMemo(() => {
    return (value: T | null) => {
      refs.forEach((it) => {
        setRef(it, value);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refs);
};

const setRef = <T>(ref: React.Ref<T>, value: T | null) => {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref) {
    (ref.current as any) = value;
  }
};
