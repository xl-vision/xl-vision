'use client';

import { styled, useTheme, ThemeVariant } from '@xl-vision/react';
import createPatterns from '@xl-vision/react/themes/shared/colors/createPatterns';
import { FC, useMemo } from 'react';

export type ThemeColorProps = {
  themeVariant: ThemeVariant;
};

const ThemeColorRoot = styled('div')(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
  };
});

const ThemeColor: FC<ThemeColorProps> = ({ themeVariant }) => {
  const { colors } = useTheme();

  const { themes } = colors;

  const themeColor = themes[themeVariant].foreground.enabled;

  const patterns = useMemo(() => {
    return createPatterns(themeColor);
  }, [themeColor]);

  const boxs = patterns.map((color) => {
    return <Box color={color} key={color} textColor={colors.getContrastText(color).primary} />;
  });

  return <ThemeColorRoot>{boxs}</ThemeColorRoot>;
};

export default ThemeColor;

type BoxProps = {
  color: string;
  textColor: string;
};

const BoxRoot = styled('div')(() => {
  return {
    height: 45,
    width: 250,
  };
});

const Box: FC<BoxProps> = ({ color, textColor }) => {
  return (
    <BoxRoot style={{ backgroundColor: color, color: textColor }}>
      <div>{color}</div>
    </BoxRoot>
  );
};
