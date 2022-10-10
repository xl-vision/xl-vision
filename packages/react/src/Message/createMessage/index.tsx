import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from '@xl-vision/icons';
import { isProduction } from '@xl-vision/utils';
import { FC, useMemo } from 'react';
import { useTheme } from '../../ThemeProvider';
import Message, { MessageProps } from './Message';

export type MessageType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

export * from './Message';

const createMessage = (type?: MessageType) => {
  const Dialog: FC<MessageProps> = (props) => {
    const { color } = useTheme();

    const defaultProps: Partial<MessageProps> = useMemo(() => {
      switch (type) {
        case 'success': {
          return {
            icon: <CheckCircleOutlined style={{ color: color.themes.primary.color }} />,
          };
        }
        case 'error': {
          return {
            icon: <CloseCircleOutlined style={{ color: color.themes.error.color }} />,
          };
        }
        case 'warning': {
          return {
            icon: <ExclamationCircleOutlined style={{ color: color.themes.warning.color }} />,
          };
        }
        case 'info': {
          return {
            icon: <InfoCircleOutlined style={{ color: color.themes.info.color }} />,
          };
        }
        case 'confirm': {
          return {
            icon: <ExclamationCircleOutlined style={{ color: color.themes.primary.color }} />,
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
