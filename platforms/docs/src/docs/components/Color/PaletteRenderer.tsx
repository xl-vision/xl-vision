'use client';

import { styled, useTheme as useLibTheme } from '@xl-vision/react';
import { Palette, PaletteVariant } from '@xl-vision/react/themes/palettes';
import { FC, memo } from 'react';
import useTheme from '@docs/components/ThemeProvider/useTheme';

export type PaletteProps = {
  palette: Palette;
};

const PaletteRoot = styled('div')(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
  };
});

const PaletteRenderer: FC<PaletteProps> = ({ palette }) => {
  const { isDark } = useTheme();
  const { colors } = useLibTheme();

  const boxs = Object.keys(palette).map((key) => {
    const color = palette[key as unknown as PaletteVariant];
    return (
      <Box
        color={color}
        key={key}
        textColor={
          (isDark ? +key > 500 : +key <= 500) ? colors.text.primary : colors.inverseText.primary
        }
      />
    );
  });

  return <PaletteRoot>{boxs}</PaletteRoot>;
};

export default memo(PaletteRenderer);

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
