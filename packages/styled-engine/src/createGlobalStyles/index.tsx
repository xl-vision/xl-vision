import { Global, css } from '@emotion/react';
import { CreateGlobalStyle,  Interpolation } from '@xl-vision/styled-engine-types';
import { useContext, } from 'react';
import ThemeContext from '../ThemeContext';

const createGlobalStyle: CreateGlobalStyle = (first, ...styles) => {
  return function (props) {
    const themeContext = useContext(ThemeContext);

    const applyTheme = (style: Interpolation<typeof props>): Interpolation<typeof props> => {
      if (typeof style === 'function') {
        return style({ ...props, theme: props.theme || themeContext });
      }
      if (Array.isArray(style)) {
        return style.map(applyTheme);
      }

      return style;
    };

    let newStyles: Interpolation<typeof props>;

    if (Array.isArray(first) && 'raw' in first) {
      newStyles = css(first, ...styles.map(applyTheme));
    } else {
      newStyles = css(applyTheme(first), ...styles.map(applyTheme));
    }

    return <Global styles={newStyles} />;
  };
};

export default createGlobalStyle;
