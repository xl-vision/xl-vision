import {
  CheckCircleFilled,
  CloseCircleFilled,
  ExclamationCircleFilled,
  InfoCircleFilled,
} from '@xl-vision/icons';
import { isProduction } from '@xl-vision/utils';
import { FC, useMemo } from 'react';
import { useTheme } from '../../ThemeProvider';
import InnerNotication, { InnerNoticationProps } from './InnerNotication';

export type NoticationType = 'success' | 'error' | 'warning' | 'info';

export * from './InnerNotication';

export type NoticationProps = InnerNoticationProps & {
  type?: NoticationType;
};

const displayName = 'Notication';

const Notication: FC<NoticationProps> = ({ type, ...others }) => {
  const { color } = useTheme();

  const defaultProps: Partial<InnerNoticationProps> = useMemo(() => {
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
      default: {
        return {};
      }
    }
  }, [color, type]);

  return <InnerNotication {...defaultProps} {...others} />;
};

if (!isProduction) {
  Notication.displayName = displayName;
}

export default Notication;
