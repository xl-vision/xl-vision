'use client';

import { styled } from '@xl-vision/react';

const Pre = styled('pre')(({ theme }) => {
  const { colors, sizes } = theme;

  const { themes } = colors;

  // const isDark = colors.mode === 'dark';

  return {
    '&[class*="language-"]': {
      overflow: 'hidden',
      margin: 0,
      padding: '6px 12px',
      backgroundColor: colors.background.default,
      borderRight: theme.sizes.middle.borderRadius,
      borderRadius: sizes.middle.borderRadius,
      color: colors.text.primary,
    },
    'code[class*="language-"]': {
      fontSize: 14,
      textShadow: 'none',
      fontFamily:
        '"Source Code Pro", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      direction: 'ltr',
      textAlign: 'left',
      whiteSpace: 'pre',
      wordSpacing: 'normal',
      wordBreak: 'normal',
      lineHeight: 1.5,
      tabSize: 4,
      hyphens: 'none',
    },

    '.token': {
      '&.property': {
        color: themes.primary.foreground.default,
      },
      '.punctuation': {
        color: colors.text.secondary,
      },
      '&.keyword, &.function': {
        color: themes.error.foreground.default,
      },
      '&.maybe-class-name': {
        color: themes.primary.foreground.default,
      },
      '&.function': {
        color: themes.error.foreground.active,
      },
      '&.property-access': {},
      '&.builtin': {},
      '&.comment': {
        color: colors.text.hint,
      },
      '&.imports': {
        '.maybe-class-name': {
          color: colors.text.primary,
        },
      },
      '&.keyword + .string': {
        color: themes.error.foreground.default,
      },
      '&.tag': {
        color: themes.success.foreground.default,

        '.class-name': {
          color: themes.primary.foreground.active,
        },

        '.attr-name': {
          color: themes.error.foreground.default,
        },
        '.attr-value': {
          color: colors.text.primary,
        },
        '.script': {
          color: themes.primary.foreground.default,
        },
      },
      '&.string, &.number, &.boolean': {},
    },
  };
});

export default Pre;
