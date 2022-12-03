import Proptypes from 'prop-types';
import clsx from 'clsx';
import { CSSObject } from '@xl-vision/styled-engine';
import { isProduction } from '@xl-vision/utils';
import { ReactNode, FC, useState, useEffect } from 'react';
import Dialog, { DialogProps } from '../Dialog';
import { styled } from '../../styles';
import usePropChange from '../../hooks/usePropChange';
import { useTheme } from '../../ThemeProvider';

export interface InnerMethodDialogProps extends Omit<DialogProps, 'children'> {
  content?: ReactNode;
  icon?: ReactNode;
}

const displayName = 'InnerMethodDialog';

const InnerMethodDialogHeader = styled('h6', {
  name: displayName,
  slot: 'Header',
})(({ theme }) => {
  const { typography } = theme;

  return {
    ...typography.h6.style,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
  };
});

const InnerMethodDialogTitle = styled('span', {
  name: displayName,
  slot: 'Title',
})(() => {
  return {
    verticalAlign: 'middle',
  };
});

const InnerMethodDialogIcon = styled('span', {
  name: displayName,
  slot: 'Icon',
})(() => {
  return {
    paddingRight: 5,
    lineHeight: 1,
    svg: {
      verticalAlign: 'middle',
    },
  };
});

const InnerMethodDialogContent = styled('div', {
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

const InnerMethodDialog: FC<InnerMethodDialogProps> = (props) => {
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

  const rootClassName = `${clsPrefix}-inner-method-dialog`;

  const headerWrapper = (
    <InnerMethodDialogHeader className={`${rootClassName}__title`}>
      {icon && (
        <InnerMethodDialogIcon className={`${rootClassName}__icon`}>{icon}</InnerMethodDialogIcon>
      )}
      <InnerMethodDialogTitle>{title}</InnerMethodDialogTitle>
    </InnerMethodDialogHeader>
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
        <InnerMethodDialogContent styleProps={{ icon: !!icon }}>{content}</InnerMethodDialogContent>
      )}
    </Dialog>
  );
};

if (!isProduction) {
  InnerMethodDialog.displayName = displayName;
  InnerMethodDialog.propTypes = {
    visible: Proptypes.bool,
    defaultVisible: Proptypes.bool,
    onVisibleChange: Proptypes.func,
    content: Proptypes.node,
    icon: Proptypes.node,
    title: Proptypes.node,
    className: Proptypes.string,
  };
}

export default InnerMethodDialog;
