import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from '@xl-vision/icons';
import { isProduction } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import { FC, useMemo } from 'react';
import InnerDedicatedDialog, { InnerDedicatedDialogProps } from './InnerDedicatedDialog';
import { useConfig } from '../../ConfigProvider';
import { useTheme } from '../../ThemeProvider';

export * from './InnerDedicatedDialog';

export type DialogType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

export type DedicatedDialogProps = InnerDedicatedDialogProps & {
  type?: DialogType;
};

const displayName = 'DedicatedDialog';

const DedicatedDialog: FC<DedicatedDialogProps> = ({ type, ...others }) => {
  const { color } = useTheme();
  const { locale } = useConfig();

  const defaultProps: Partial<InnerDedicatedDialogProps> = useMemo(() => {
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

  return <InnerDedicatedDialog {...defaultProps} {...others} />;
};

if (!isProduction) {
  DedicatedDialog.displayName = displayName;
  DedicatedDialog.propTypes = {
    type: PropTypes.oneOf<DialogType>(['confirm', 'error', 'info', 'success', 'warning']),
  };
}

export default DedicatedDialog;
