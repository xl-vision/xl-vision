import { styled } from '@xl-vision/react';
import PropTypes from 'prop-types';
import React from 'react';
import code from './code';
import pre from './pre';

export type WrapperProps = {
  children?: React.ReactNode;
  className?: string;
};

const Root = styled('main')(
  ({ theme }) => `
    min-height: 100%;
    margin: 0 16px;
    & :not(${pre}) {
      & > ${code} {
        display: inline-block;
        margin: 0.1em 0.2em;
        padding: 0 0.4em;
        font-size: 0.8em;
        font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;
        background-color: ${theme.color.emphasize(theme.color.background.paper, 0.08)};
        border: 1px solid ${theme.color.divider};
        border-radius: 3px;
      }
    }
`,
);

const Wrapper: React.FunctionComponent<WrapperProps> = (props) => {
  const { children, ...others } = props;

  return <Root {...others}>{children}</Root>;
};

Wrapper.propTypes = {
  children: PropTypes.node,
};

export default Wrapper;
