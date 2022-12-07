import PropTypes from 'prop-types';
import clsx from 'clsx';
import { CSSObject } from '@xl-vision/styled-engine';
import { isProduction } from '@xl-vision/utils';
import { ReactNode, FC, useState, useEffect } from 'react';
import Dialog, { DialogProps } from '../Dialog';
import { styled } from '../../styles';
import usePropChange from '../../hooks/usePropChange';
import { useTheme } from '../../ThemeProvider';

export interface InnerDedicatedDialogProps extends Omit<DialogProps, 'children'> {
  content?: ReactNode;
  icon?: ReactNode;
}

const displayName = 'InnerDedicatedDialog';

const InnerDedicatedDialogHeader = styled('h6', {
  name: displayName,
  slot: 'Header',
})(({ theme }) => {
  const { typography, clsPrefix } = theme;

  const rootClassName = `${clsPrefix}-inner-dedicated-dialog`;

  return {
    ...typography.h6.style,
    margin: 0,
    display: 'flex',
    alignItems: 'center',

    [`.${rootClassName}__icon`]: {
      paddingRight: 5,
      lineHeight: 1,
      svg: {
        verticalAlign: 'middle',
      },
    },
    [`.${rootClassName}__title`]: {
      verticalAlign: 'middle',
    },
  };
});

const InnerDedicatedDialogContent = styled('div', {
  name: displayName,
  slot: 'Content',
})<{
  icon: boolean;
}>(({ styleProps }) => {
  const { icon } = styleProps;
  const styles: CSSObject = {};

  if (icon) {
    styles.paddingLeft = 25;
  }

  return styles;
});

const InnerDedicatedDialog: FC<InnerDedicatedDialogProps> = (props) => {
  const {
    visible: visibleProp,
    defaultVisible: defaultVisibleProp = false,
    onVisibleChange: onVisibleChangeProp,
    content,
    icon,
    title,
    className,
    ...others
  } = props;

  const [visible, handleVisibleChange] = usePropChange(
    defaultVisibleProp,
    visibleProp,
    onVisibleChangeProp,
  );

  const [first, setFirst] = useState(true);

  const { clsPrefix } = useTheme();

  // 保证有对话框弹出的动画效果
  useEffect(() => {
    setFirst(false);
  }, []);

  const rootClassName = `${clsPrefix}-inner-dedicated-dialog`;

  const headerWrapper = (
    <InnerDedicatedDialogHeader className={`${rootClassName}__header`}>
      {icon && <span className={`${rootClassName}__icon`}>{icon}</span>}
      <span className={`${rootClassName}__title`}>{title}</span>
    </InnerDedicatedDialogHeader>
  );

  return (
    <Dialog
      {...others}
      className={clsx(rootClassName, className)}
      title={headerWrapper}
      visible={!first && visible}
      onVisibleChange={handleVisibleChange}
    >
      {content && (
        <InnerDedicatedDialogContent
          className={`${rootClassName}__content`}
          styleProps={{ icon: !!icon }}
        >
          {content}
        </InnerDedicatedDialogContent>
      )}
    </Dialog>
  );
};

if (!isProduction) {
  InnerDedicatedDialog.displayName = displayName;
  InnerDedicatedDialog.propTypes = {
    className: PropTypes.string,
    content: PropTypes.node,
    defaultVisible: PropTypes.bool,
    icon: PropTypes.node,
    title: PropTypes.node,
    visible: PropTypes.bool,
    onVisibleChange: PropTypes.func,
  };
}

export default InnerDedicatedDialog;
