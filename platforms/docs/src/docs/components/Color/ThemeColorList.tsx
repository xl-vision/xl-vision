'use client';

import { styled, useTheme, ThemeVariant } from '@xl-vision/react';
import ThemeColor from './ThemeColor';

const ThemeColorListRoot = styled('div')(() => {
  return {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    '> *': {
      margin: 8,
    },
  };
});

const ThemeColorList = () => {
  const { colors } = useTheme();

  const { themes } = colors;

  return (
    <ThemeColorListRoot>
      {Object.keys(themes).map((key) => (
        <ThemeColor key={key} themeVariant={key as ThemeVariant} />
      ))}
    </ThemeColorListRoot>
  );
};

export default ThemeColorList;
