import { Global, css } from '@emotion/react';
import { CreateGlobalStyle, Interpolation } from '@xl-vision/styled-engine-types';
import { useContext } from 'react';
import ThemeContext from '../ThemeContext';

const createGlobalStyle: CreateGlobalStyle = (first, ...styles) => {
  return function GlobalStyle(props) {
    const themeContext = useContext(ThemeContext);

    const applyTheme = (style: Interpolation<typeof props>): Interpolation<typeof props> => {
      if (typeof style === 'function') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, react/prop-types
        return applyTheme(style({ ...props, theme: props.theme || themeContext }));
      }
      if (Array.isArray(style)) {
        return style.map(applyTheme);
      }

      return style;
    };

    const newStyles =
      Array.isArray(first) && 'raw' in first
        ? css(first, ...styles.map(applyTheme))
        : css(applyTheme(first), ...styles.map(applyTheme));

    return <Global styles={newStyles} />;
  };
};

export default createGlobalStyle;
