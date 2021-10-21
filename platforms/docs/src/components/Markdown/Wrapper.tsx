import { styled } from '@xl-vision/react';
import PropTypes from 'prop-types';
import React from 'react';

export type WrapperProps = {
  children?: React.ReactNode;
  className?: string;
};

const Root = styled('main')(() => {
  return {
    minHeight: '100%',
    padding: '0 16px',
  };
});

const Wrapper: React.FunctionComponent<WrapperProps> = (props) => {
  const { children, ...others } = props;

  return <Root {...others}>{children}</Root>;
};

Wrapper.propTypes = {
  children: PropTypes.node,
};

export default Wrapper;
