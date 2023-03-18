import { useValueChange } from '@xl-vision/hooks';
import { CSSObject } from '@xl-vision/styled-engine';
import { isProduction } from '@xl-vision/utils';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { ReactNode, FC, useState, useEffect } from 'react';
import { useConfig } from '../../ConfigProvider';
import { styled } from '../../styles';
import Dialog, { DialogProps } from '../Dialog';

export interface InnerDedicatedDialogProps extends Omit<DialogProps, 'children'> {
  content?: ReactNode;
  icon?: ReactNode;
}

const displayName = 'InnerDedicatedDialog';

const InnerDedicatedDialogHeader = styled('h6', {
  name: displayName,
  slot: 'Header',
})(({ theme, clsPrefix }) => {
  const { typography } = theme;

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
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    content,
    icon,
    title,
    className,
    ...others
  } = props;

  const [open, handleOpenChange] = useValueChange(defaultOpen, openProp, onOpenChange);

  const [first, setFirst] = useState(true);

  const { clsPrefix } = useConfig();

  // 保证有对话框弹出的动画效果
  useEffect(() => {
    setFirst(false);
  }, []);

  const rootClassName = `${clsPrefix}-inner-dedicated-dialog`;

  const headerWrapper = (
    <InnerDedicatedDialogHeader>
      {icon && <span className={`${rootClassName}__icon`}>{icon}</span>}
      <span className={`${rootClassName}__title`}>{title}</span>
    </InnerDedicatedDialogHeader>
  );

  return (
    <Dialog
      {...others}
      className={clsx(rootClassName, className)}
      open={!first && open}
      title={headerWrapper}
      onOpenChange={handleOpenChange}
    >
      {content && (
        <InnerDedicatedDialogContent styleProps={{ icon: !!icon }}>
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
    defaultOpen: PropTypes.bool,
    icon: PropTypes.node,
    open: PropTypes.bool,
    title: PropTypes.node,
    onOpenChange: PropTypes.func,
  };
}

export default InnerDedicatedDialog;
