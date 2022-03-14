import React from 'react';
import { useTheme } from '../ThemeProvider';

const useBreakPoints = () => {
  const { breakpoints } = useTheme();

  const { values, unit } = breakpoints;

  const [media, setMedia] = React.useState<{ [key: string]: boolean }>({});

  const breakPointArray = React.useMemo(() => {
    return Object.keys(values).sort((a, b) => values[b] - values[a]);
  }, [values]);

  React.useEffect(() => {
    const handlerMap: {
      [breakPoint: string]: {
        listener: EventListener;
        mediaQuery: ReturnType<typeof matchMedia>;
      };
    } = {};
    const keys = Object.keys(values);
    keys.forEach((key) => {
      const size = values[key];
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

  return React.useMemo<Array<[string, boolean]>>(
    () => breakPointArray.map((key) => [key, media[key]]),
    [breakPointArray, media],
  );
};

export default useBreakPoints;
