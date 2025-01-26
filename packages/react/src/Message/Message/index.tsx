import {
  CheckCircleFilled,
  CloseCircleFilled,
  ExclamationCircleFilled,
  InfoCircleFilled,
  LoadingOutlined,
} from '@xl-vision/icons';
import { keyframes } from '@xl-vision/styled-engine';
import { isProduction } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import { FC, useMemo } from 'react';
import Message, { MessageProps } from './Message';
import { styled } from '../../styles';
import { useTheme } from '../../ThemeProvider';

export type MessageType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export * from './Message';

export type MessageWrapperProps = MessageProps & {
  type?: MessageType;
};

const displayName = 'Message';

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
  name: displayName,
  slot: 'LoadingIcon',
})`
  animation: ${loadingKeyframes} 1s linear infinite;
`;

const MessageWrapper: FC<MessageWrapperProps> = ({ type, ...others }) => {
  const { colors } = useTheme();

  const defaultProps: Partial<MessageProps> = useMemo(() => {
    switch (type) {
      case 'success': {
        return {
          icon: <CheckCircleFilled style={{ color: colors.themes.success.foreground.default }} />,
        };
      }
      case 'error': {
        return {
          icon: <CloseCircleFilled style={{ color: colors.themes.error.foreground.default }} />,
        };
      }
      case 'warning': {
        return {
          icon: (
            <ExclamationCircleFilled style={{ color: colors.themes.warning.foreground.default }} />
          ),
        };
      }
      case 'info': {
        return {
          icon: <InfoCircleFilled style={{ color: colors.themes.info.foreground.default }} />,
        };
      }
      case 'loading': {
        return {
          icon: <DefaultLoadingIcon style={{ color: colors.themes.primary.foreground.default }} />,
        };
      }
      default: {
        return {};
      }
    }
  }, [colors, type]);

  return <Message {...defaultProps} {...others} />;
};

if (!isProduction) {
  MessageWrapper.displayName = displayName;
  MessageWrapper.propTypes = {
    type: PropTypes.oneOf<MessageType>(['error', 'info', 'loading', 'success', 'warning']),
  };
}

export default MessageWrapper;
