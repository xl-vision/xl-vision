import {
  CheckCircleFilled,
  CloseCircleFilled,
  ExclamationCircleFilled,
  InfoCircleFilled,
} from '@xl-vision/icons';
import { isProduction } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import { FC, useMemo } from 'react';
import NoticationInternal, { NoticationProps } from './Notication';
import { useTheme } from '../../ThemeProvider';

export type NoticationType = 'success' | 'error' | 'warning' | 'info';

export * from './Notication';

export type NoticationWrapperProps = NoticationProps & {
  type?: NoticationType;
};

const displayName = 'NoticationWrapper';

const NoticationWrapper: FC<NoticationWrapperProps> = ({ type, ...others }) => {
  const { colors } = useTheme();

  const defaultProps: Partial<NoticationProps> = useMemo(() => {
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
      default: {
        return {};
      }
    }
  }, [colors, type]);

  return <NoticationInternal {...defaultProps} {...others} />;
};

if (!isProduction) {
  NoticationWrapper.displayName = displayName;
  NoticationWrapper.propTypes = {
    type: PropTypes.oneOf<NoticationType>(['error', 'info', 'success', 'warning']),
  };
}

export default NoticationWrapper;
