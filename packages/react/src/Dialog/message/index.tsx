import React from 'react';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from '@xl-vision/icons';
import { env } from '@xl-vision/utils';
import MessageDialog, { MessageDialogProps } from './MessageDialog';
import { useTheme } from '../../ThemeProvider';
import { useLocale } from '../../LocalizationProvider';

export type MessageDialogType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

export * from './MessageDialog';

const createMessageDialog = (type?: MessageDialogType) => {
  const Dialog: React.FunctionComponent<MessageDialogProps> = (props) => {
    const { color } = useTheme();
    const { locale } = useLocale();

    const defaultProps: Partial<MessageDialogProps> = React.useMemo(() => {
      switch (type) {
        case 'success': {
          return {
            icon: <CheckCircleOutlined style={{ color: color.themes.primary.color }} />,
            confirmText: locale.Dialog.messages.successText,
            prompt: true,
          };
        }
        case 'error': {
          return {
            icon: <CloseCircleOutlined style={{ color: color.themes.error.color }} />,
            confirmText: locale.Dialog.messages.errorText,
            prompt: true,
          };
        }
        case 'warning': {
          return {
            icon: <ExclamationCircleOutlined style={{ color: color.themes.warning.color }} />,
            confirmText: locale.Dialog.messages.warningText,
            prompt: true,
          };
        }
        case 'info': {
          return {
            icon: <InfoCircleOutlined style={{ color: color.themes.info.color }} />,
            confirmText: locale.Dialog.messages.infoText,
            prompt: true,
          };
        }
        case 'confirm': {
          return {
            icon: <ExclamationCircleOutlined style={{ color: color.themes.primary.color }} />,
            confirmText: locale.Dialog.messages.confirm.confirmText,
            cancelText: locale.Dialog.messages.confirm.cancelText,
          };
        }
        default: {
          return {};
        }
      }
    }, [color, locale]);

    return <MessageDialog {...defaultProps} {...props} />;
  };

  if (!env.isProduction) {
    const displayName = type
      ? `${type.replace(/^./, (match) => match.toUpperCase())}Dialog`
      : 'CustomMessageDialog';
    Dialog.displayName = displayName;
  }

  return Dialog;
};

export default createMessageDialog;
