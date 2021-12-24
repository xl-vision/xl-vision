import React from 'react';
import { Row } from '@xl-vision/react';

const { useBreakPoints } = Row;

const UseBreakPoints = () => {
  const breakPoints = useBreakPoints();

  return (
    <>
      Current break points:
      {breakPoints
        .filter((it) => it[1])
        .map((it) => it[0])
        .join(',')}
    </>
  );
};

export default UseBreakPoints;
