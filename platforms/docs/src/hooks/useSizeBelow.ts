import { Row } from '@xl-vision/react';
import { env } from '@xl-vision/utils';
import React, { useState } from 'react';

const { useBreakPoints } = Row;

const useSizeBelow = (breakpoint: string) => {
  const breakPoints = useBreakPoints();

  const [state, setState] = useState(false);

  React.useEffect(() => {
    let isBelow = false;
    if (env.isBrowser) {
      const md = breakPoints.find((it) => it[0] === breakpoint);
      if (md) {
        isBelow = !md[1];
      }
    }
    setState(isBelow);
  }, [breakpoint, breakPoints]);

  return state;
};

export default useSizeBelow;
