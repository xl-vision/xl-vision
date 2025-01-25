import { isProduction } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import { ReactNode, FC } from 'react';
import { createGlobalStyles } from '../styles';

export type CssBaselineProps = {
  children?: ReactNode;
};

const GlobalStyles = createGlobalStyles(({ theme }) => {
  const styles = theme.overrideStyles.CssBaseline?.Root;

  return [
    {
      html: {
        WebkitFontSmoothing: 'antialiased', // Antialiasing.
        MozOsxFontSmoothing: 'grayscale', // Antialiasing.
        // Change from `box-sizing: content-box` so that `width`
        // is not affected by `padding` or `border`.
        boxSizing: 'border-box',
        // Fix font resize problem in iOS
        WebkitTextSizeAdjust: '100%',
      },
      '*, *::before, *::after': {
        boxSizing: 'inherit',
      },
      'strong, b': {
        fontWeight: theme.typography.fontWeight.bold,
      },
      body: {
        ...theme.typography.body1.style,
        color: theme.colors.text.primary,
        backgroundColor: theme.colors.background.default,
        margin: 0,
        '&::backdrop': {
          backgroundColor: theme.colors.background.default,
        },
        '@media print': {
          // Save printer ink.
          backgroundColor: '#ffffff',
        },
      },
    },
    styles?.(theme),
  ];
});

const CssBaseline: FC<CssBaselineProps> = (props) => {
  const { children } = props;

  return (
    <>
      <GlobalStyles />
      {children}
    </>
  );
};

if (!isProduction) {
  CssBaseline.displayName = 'CssBaseline';
  CssBaseline.propTypes = {
    children: PropTypes.node,
  };
}

export default CssBaseline;
