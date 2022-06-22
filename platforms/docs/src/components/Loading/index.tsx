import { styled } from '@xl-vision/react';
import React from 'react';
import { LoadingOutlined } from '@xl-vision/icons';
import { keyframes } from '@xl-vision/styled-engine';

const Root = styled('div')(({ theme }) => {
  return {
    width: '100%',
    height: '100%',
    backgroundColor: theme.color.grey[100],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
});

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Icon = styled(LoadingOutlined)`
  animation: ${rotate} 1s linear infinite;
  color: ${({ theme }) => theme.color.themes.primary.color};
  font-size: 48px;
`;

const Loading: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
  return (
    <Root {...props}>
      <Icon />
    </Root>
  );
};

export default Loading;
