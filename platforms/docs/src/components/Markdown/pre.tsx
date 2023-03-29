import { styled } from '@xl-vision/react';

const Pre = styled('pre')(({ theme }) => {
  const { colors, sizes } = theme;

  // const isDark = colors.mode === 'dark';

  return {
    '&[class*="language-"]': {
      borderRadius: sizes.middle.border,
      overflow: 'hidden',
      margin: 0,
      padding: '6px 12px',
      // backgroundColor: isDark ? grey.A400 : grey[100],
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
      '.punctuation': {
        color: colors.text.secondary,
      },
      '&.keyword, &.function': {
        // color: isDark ? blue[300] : red[400],
      },
      '&.function .maybe-class-name': {
        // color: isDark ? cyan[300] : purple[500],
      },
      '&.function-variable': {
        color: colors.text.primary,
      },
      '&.property-access': {
        // color: isDark ? blue[300] : blue[500],
      },
      '&.builtin': {
        // color: isDark ? blue[300] : blue[500],
      },
      '&.comment': {
        color: colors.text.hint,
      },
      '&.imports': {
        '.maybe-class-name': {
          color: colors.text.primary,
        },
      },
      '&.keyword + .string': {
        // color: isDark ? deepPurple[300] : grey[800],
      },
      '&.tag': {
        // color: isDark ? yellow[800] : green[300],

        '.attr-name': {
          // color: isDark ? blue[300] : indigo[400],
        },
        '.attr-value': {
          // color: isDark ? purple[400] : indigo[400],
        },
        '.script': {
          color: colors.text.primary,
        },
      },
      '&.string, &.number, &.boolean': {},
    },
  };
});

export default Pre;
