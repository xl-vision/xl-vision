import { Global } from '@emotion/react';
import { CreateGlobalStyle } from '@xl-vision/styled-engine-types';
import { useContext } from 'react';
import ThemeContext from '../ThemeContext';

const createGlobalStyle: CreateGlobalStyle = (styles) => {
  return function (props) {
    const themeContext = useContext(ThemeContext);

    const newStyles =
      typeof styles === 'function'
        ? () => styles({ ...props, theme: props.theme || themeContext })
        : styles;

    return <Global styles={newStyles} />;
  };
};

export default createGlobalStyle;
