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
import { useTheme } from '../../ThemeProvider';

export * from './InnerDedicatedDialog';

export type DialogType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

export type DedicatedDialogProps = InnerDedicatedDialogProps & {
  type?: DialogType;
};

const displayName = 'DedicatedDialog';

const DedicatedDialog: FC<DedicatedDialogProps> = ({ type, ...others }) => {
  const { colors, locale } = useTheme();

  const defaultProps: Partial<InnerDedicatedDialogProps> = useMemo(() => {
    switch (type) {
      case 'success': {
        return {
          icon: <CheckCircleOutlined style={{ color: colors.themes.success.foreground.default }} />,
          confirmText: locale.Dialog.methods.successText,
          prompt: true,
        };
      }
      case 'error': {
        return {
          icon: <CloseCircleOutlined style={{ color: colors.themes.error.foreground.default }} />,
          confirmText: locale.Dialog.methods.errorText,
          prompt: true,
        };
      }
      case 'warning': {
        return {
          icon: (
            <ExclamationCircleOutlined
              style={{ color: colors.themes.warning.foreground.default }}
            />
          ),
          confirmText: locale.Dialog.methods.warningText,
          prompt: true,
        };
      }
      case 'info': {
        return {
          icon: <InfoCircleOutlined style={{ color: colors.themes.info.foreground.default }} />,
          confirmText: locale.Dialog.methods.infoText,
          prompt: true,
        };
      }
      case 'confirm': {
        return {
          icon: (
            <ExclamationCircleOutlined
              style={{ color: colors.themes.primary.foreground.default }}
            />
          ),
          confirmText: locale.Dialog.methods.confirm.confirmText,
          cancelText: locale.Dialog.methods.confirm.cancelText,
        };
      }
      default: {
        return {};
      }
    }
  }, [type, colors, locale]);

  return <InnerDedicatedDialog {...defaultProps} {...others} />;
};

if (!isProduction) {
  DedicatedDialog.displayName = displayName;
  DedicatedDialog.propTypes = {
    type: PropTypes.oneOf<DialogType>(['confirm', 'error', 'info', 'success', 'warning']),
  };
}

export default DedicatedDialog;
