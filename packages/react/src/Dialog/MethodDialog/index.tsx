import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from '@xl-vision/icons';
import { FC, useMemo } from 'react';
import { isProduction } from '@xl-vision/utils';
import InnerMethodDialog, { InnerMethodDialogProps } from './InnerMethodDialog';
import { useTheme } from '../../ThemeProvider';
import { useConfig } from '../../ConfigProvider';

export * from './InnerMethodDialog';

export type DialogType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

export type MethodDialogProps = InnerMethodDialogProps & {
  type?: DialogType;
};

const displayName = 'MethodDialog';

const MethodDialog: FC<MethodDialogProps> = ({ type, ...others }) => {
  const { color } = useTheme();
  const { locale } = useConfig();

  const defaultProps: Partial<InnerMethodDialogProps> = useMemo(() => {
    switch (type) {
      case 'success': {
        return {
          icon: <CheckCircleOutlined style={{ color: color.themes.success.color }} />,
          confirmText: locale.Dialog.methods.successText,
          prompt: true,
        };
      }
      case 'error': {
        return {
          icon: <CloseCircleOutlined style={{ color: color.themes.error.color }} />,
          confirmText: locale.Dialog.methods.errorText,
          prompt: true,
        };
      }
      case 'warning': {
        return {
          icon: <ExclamationCircleOutlined style={{ color: color.themes.warning.color }} />,
          confirmText: locale.Dialog.methods.warningText,
          prompt: true,
        };
      }
      case 'info': {
        return {
          icon: <InfoCircleOutlined style={{ color: color.themes.info.color }} />,
          confirmText: locale.Dialog.methods.infoText,
          prompt: true,
        };
      }
      case 'confirm': {
        return {
          icon: <ExclamationCircleOutlined style={{ color: color.themes.primary.color }} />,
          confirmText: locale.Dialog.methods.confirm.confirmText,
          cancelText: locale.Dialog.methods.confirm.cancelText,
        };
      }
      default: {
        return {};
      }
    }
  }, [type, color, locale]);

  return <InnerMethodDialog {...defaultProps} {...others} />;
};

if (!isProduction) {
  MethodDialog.displayName = displayName;
}

export default MethodDialog;
