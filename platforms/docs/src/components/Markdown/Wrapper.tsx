'use client';

import { styled } from '@xl-vision/react';
import PropTypes from 'prop-types';
import { ReactNode, FC } from 'react';
import code from './code';
import pre from './pre';

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
        border: 1px solid ${theme.colors.divider.primary};
        border-radius: 3px;
      }
    }
`,
);

export type WrapperProps = {
  children?: ReactNode;
  className?: string;
};

const Wrapper: FC<WrapperProps> = (props: WrapperProps) => {
  const { children, ...others } = props;

  return <Root {...others}>{children}</Root>;
};

Wrapper.propTypes = {
  children: PropTypes.node,
};

export default Wrapper;
