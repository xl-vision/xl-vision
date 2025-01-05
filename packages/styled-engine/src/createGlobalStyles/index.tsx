import { Global } from '@emotion/react';
import { CreateGlobalStyle } from '@xl-vision/styled-engine-types';

const createGlobalStyle: CreateGlobalStyle = (styles) => {
  return function (props) {
    const { theme, ...others } = props;

    const newStyles = typeof styles === 'function' ? () => styles({ ...others, theme }) : styles;
    return <Global styles={newStyles} />;
  };
};

export default createGlobalStyle;
