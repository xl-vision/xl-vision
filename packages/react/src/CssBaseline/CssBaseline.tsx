import { CSSObject } from '@xl-vision/styled-engine';
import { isProduction } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import { ReactNode, FC } from 'react';
import { createGlobalStyles } from '../styles';
import { Theme, useTheme } from '../ThemeProvider';

export type CssBaselineProps = {
  children?: ReactNode;
};

export type CssBaselineStyleProps = { overrideStyle?: (theme: Theme) => CSSObject };

const GlobalStyles = createGlobalStyles<CssBaselineStyleProps>(({ theme, styleProps }) => {
  const { overrideStyle } = styleProps;

  const styles = overrideStyle?.(theme);

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
    styles,
  ];
});

const CssBaseline: FC<CssBaselineProps> = (props) => {
  const { children } = props;
  const { overrideStyles } = useTheme();

  const overrideStyle = overrideStyles.CssBaseline?.Root;

  return (
    <>
      <GlobalStyles styleProps={{ overrideStyle }} />
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
