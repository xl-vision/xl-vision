import { isBrowser } from '@xl-vision/utils';
import { useEffect, useState } from 'react';

const useMedia = (query: string, defaultState: boolean = false) => {
  const [state, setState] = useState(
    isBrowser ? () => window.matchMedia(query).matches : defaultState,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);

    const handleChange = () => {
      setState(mql.matches);
    };

    mql.addListener(handleChange);

    setState(mql.matches);

    return () => {
      mql.removeListener(handleChange);
    };
  }, [query]);

  return state;
};

export default useMedia;
