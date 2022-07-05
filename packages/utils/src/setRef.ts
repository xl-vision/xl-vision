type Ref<T> = ((instance: T | null) => void) | { current: T | null };

const setRef = <T>(ref: Ref<T> | undefined | null, value: T | null) => {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
};

export default setRef;
