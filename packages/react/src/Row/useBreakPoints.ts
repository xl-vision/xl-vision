import { useState, useMemo, useEffect } from 'react';
import { useTheme } from '../ThemeProvider';
import { Breakpoint } from '../ThemeProvider/breakpoints';

const useBreakPoints = () => {
  const { breakpoints } = useTheme();

  const { values, unit } = breakpoints;

  const [media, setMedia] = useState<{ [key: string]: boolean }>({});

  const breakPointArray = useMemo(() => {
    return Object.keys(values).sort((a, b) => values[b as Breakpoint] - values[a as Breakpoint]);
  }, [values]);

  useEffect(() => {
    const handlerMap: {
      [breakPoint: string]: {
        listener: EventListener;
        mediaQuery: ReturnType<typeof matchMedia>;
      };
    } = {};
    const keys = Object.keys(values);
    keys.forEach((key) => {
      const size = values[key as Breakpoint];
      const query = `(min-width: ${size}${unit})`;
      const mql = matchMedia(query);
      const onChange = () => {
        setMedia((prev) => ({
          ...prev,
          [key]: mql.matches,
        }));
      };
      handlerMap[key] = {
        listener: onChange,
        mediaQuery: mql,
      };
      mql.addListener(onChange);
      onChange();
    });
    return () => {
      keys.forEach((key) => {
        const { mediaQuery, listener } = handlerMap[key];
        mediaQuery.removeListener(listener);
      });
    };
  }, [values, unit]);

  return useMemo<Array<[Breakpoint, boolean]>>(
    () => breakPointArray.map((key) => [key as Breakpoint, media[key]]),
    [breakPointArray, media],
  );
};

export default useBreakPoints;
