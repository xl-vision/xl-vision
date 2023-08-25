import { LoadingOutlined } from '@xl-vision/icons';
import { styled } from '@xl-vision/react';
import { keyframes } from '@xl-vision/styled-engine';
import { FC, HTMLAttributes } from 'react';

const Root = styled('div')(({ theme }) => {
  return {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.text.hint,
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
  color: ${({ theme }) => theme.colors.themes.primary.foreground.enabled};
  font-size: 48px;
`;

const Loading: FC<HTMLAttributes<HTMLDivElement>> = (props) => {
  return (
    <Root {...props}>
      <Icon />
    </Root>
  );
};

export default Loading;
