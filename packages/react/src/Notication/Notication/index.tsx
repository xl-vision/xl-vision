import {
  CheckCircleFilled,
  CloseCircleFilled,
  ExclamationCircleFilled,
  InfoCircleFilled,
} from '@xl-vision/icons';
import { isProduction } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import { FC, useMemo } from 'react';
import InnerNotication, { InnerNoticationProps } from './InnerNotication';
import { useTheme } from '../../ThemeProvider';

export type NoticationType = 'success' | 'error' | 'warning' | 'info';

export * from './InnerNotication';

export type NoticationProps = InnerNoticationProps & {
  type?: NoticationType;
};

const displayName = 'Notication';

const Notication: FC<NoticationProps> = ({ type, ...others }) => {
  const { colors } = useTheme();

  const defaultProps: Partial<InnerNoticationProps> = useMemo(() => {
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

  return <InnerNotication {...defaultProps} {...others} />;
};

if (!isProduction) {
  Notication.displayName = displayName;
  Notication.propTypes = {
    type: PropTypes.oneOf<NoticationType>(['error', 'info', 'success', 'warning']),
  };
}

export default Notication;
