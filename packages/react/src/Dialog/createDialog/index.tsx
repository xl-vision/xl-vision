import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from '@xl-vision/icons';
import { isProduction } from '@xl-vision/utils';
import { FC, useMemo } from 'react';
import MethodDialog, { MethodDialogProps } from './MethodDialog';
import { useTheme } from '../../ThemeProvider';
import { useConfig } from '../../ConfigProvider';

export type DialogType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

export * from './MethodDialog';

const createDialog = (type?: DialogType) => {
  const Dialog: FC<MethodDialogProps> = (props) => {
    const { color } = useTheme();
    const { locale } = useConfig();

    const defaultProps: Partial<MethodDialogProps> = useMemo(() => {
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

    return <MethodDialog {...defaultProps} {...props} />;
  };

  if (!isProduction) {
    const displayName = type
      ? `${type.replace(/^./, (match) => match.toUpperCase())}Dialog`
      : 'CustomMessageDialog';
    Dialog.displayName = displayName;
  }

  return Dialog;
};

export default createDialog;
