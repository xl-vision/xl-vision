'use client';

import { createGlobalStyles } from '@xl-vision/react';

const GlobalStyle = createGlobalStyles(({ theme }) => {
  const { colors, breakpoints } = theme;

  const { values, unit } = breakpoints;

  return {
    'html,body': {
      width: '100%',
      height: '100%',
    },
    '#__next': {
      height: '100%',
    },
    '::-webkit-scrollbar': {
      width: 8,
      height: 8,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    // '::-webkit-scrollbar-track': {
    //   boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.3)',
    // },
    '::-webkit-scrollbar-thumb': {
      backgroundColor: colors.text.hint,
      borderRadius: 5,
    },
    '.sm-down': {
      [`@media (min-width: ${values.sm + 1}${unit})`]: {
        display: 'none !important',
      },
    },
    '.sm-up': {
      [`@media (max-width: ${values.sm}${unit})`]: {
        display: 'none !important',
      },
    },
    '.md-down': {
      [`@media (min-width: ${values.md + 1}${unit})`]: {
        display: 'none !important',
      },
    },
    '.md-up': {
      [`@media (max-width: ${values.md}${unit})`]: {
        display: 'none !important',
      },
    },
  };
});

export default GlobalStyle;
