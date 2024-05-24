'use client';

import { styled } from '@xl-vision/react';
import * as palettes from '@xl-vision/react/themes/palettes';
import PaletteRenderer from './PaletteRenderer';

const PalettesRoot = styled('div')(() => {
  return {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    '> *': {
      margin: 8,
    },
  };
});

const Palettes = () => {
  return (
    <PalettesRoot>
      {Object.keys(palettes).map((key) => (
        <PaletteRenderer key={key} palette={palettes[key as keyof typeof palettes]} />
      ))}
    </PalettesRoot>
  );
};

export default Palettes;
