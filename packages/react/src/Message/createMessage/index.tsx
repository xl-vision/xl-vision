import {
  CheckCircleFilled,
  CloseCircleFilled,
  ExclamationCircleFilled,
  InfoCircleFilled,
  LoadingOutlined,
} from '@xl-vision/icons';
import { keyframes } from '@xl-vision/styled-engine';
import { isProduction } from '@xl-vision/utils';
import { FC, useMemo } from 'react';
import { useTheme } from '../../ThemeProvider';
import Message, { MessageProps } from './Message';
import { styled } from '../../styles';

export type MessageType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export * from './Message';

const loadingKeyframes = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// This `styled()` function invokes keyframes. `styled-components` only supports keyframes
// in string templates. Do not convert these styles in JS object as it will break.
const DefaultLoadingIcon = styled(LoadingOutlined, {
  name: 'Message',
  slot: 'LoadingIcon',
})`
  animation: ${loadingKeyframes} 1s linear infinite;
`;

const createMessage = (type?: MessageType) => {
  const Dialog: FC<MessageProps> = (props) => {
    const { color } = useTheme();

    const defaultProps: Partial<MessageProps> = useMemo(() => {
      switch (type) {
        case 'success': {
          return {
            icon: <CheckCircleFilled style={{ color: color.themes.success.color }} />,
          };
        }
        case 'error': {
          return {
            icon: <CloseCircleFilled style={{ color: color.themes.error.color }} />,
          };
        }
        case 'warning': {
          return {
            icon: <ExclamationCircleFilled style={{ color: color.themes.warning.color }} />,
          };
        }
        case 'info': {
          return {
            icon: <InfoCircleFilled style={{ color: color.themes.info.color }} />,
          };
        }
        case 'loading': {
          return {
            icon: <DefaultLoadingIcon style={{ color: color.themes.primary.color }} />,
          };
        }
        default: {
          return {};
        }
      }
    }, [color]);

    return <Message {...defaultProps} {...props} />;
  };

  if (!isProduction) {
    const displayName = type
      ? `${type.replace(/^./, (match) => match.toUpperCase())}Message`
      : 'CustomMessage';
    Dialog.displayName = displayName;
  }

  return Dialog;
};

export default createMessage;
