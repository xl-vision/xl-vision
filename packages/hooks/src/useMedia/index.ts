import { useEffect, useState } from 'react';
import { env } from '@xl-vision/utils';

const useMedia = (query: string, defaultState: boolean = false) => {
  const [state, setState] = useState(
    env.isBrowser ? () => window.matchMedia(query).matches : defaultState,
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
