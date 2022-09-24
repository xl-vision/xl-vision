import Proptypes from 'prop-types';
import clsx from 'clsx';
import { CSSObject } from '@xl-vision/styled-engine';
import { isProduction } from '@xl-vision/utils';
import { ReactNode, FC, useState, useEffect } from 'react';
import Dialog, { DialogProps } from '../Dialog';
import { styled } from '../../styles';
import usePropChange from '../../hooks/usePropChange';
import { useTheme } from '../../ThemeProvider';

export interface MessageDialogProps extends Omit<DialogProps, 'children'> {
  content?: ReactNode;
  icon?: ReactNode;
}

const displayName = 'MessageDialog';

const MessageDialogHeader = styled('h6', {
  name: displayName,
  slot: 'Header',
})(({ theme }) => {
  const { typography } = theme;

  return {
    ...typography.h6.style,
    margin: 0,
  };
});

const MessageDialogTitle = styled('span', {
  name: displayName,
  slot: 'Title',
})(() => {
  return {
    verticalAlign: 'middle',
  };
});

const MessageDialogIcon = styled('span', {
  name: displayName,
  slot: 'Icon',
})(() => {
  return {
    paddingRight: 5,
    svg: {
      verticalAlign: 'middle',
    },
  };
});

export type MessageDialogContentStyleProps = {
  icon: boolean;
};

const MessageDialogContent = styled('div', {
  name: displayName,
  slot: 'Content',
})<MessageDialogContentStyleProps>(({ styleProps }) => {
  const { icon } = styleProps;
  const styles: CSSObject = {};

  if (icon) {
    styles.paddingLeft = 25;
  }

  return styles;
});

const MessageDialog: FC<MessageDialogProps> = (props) => {
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

  const rootClassName = `${clsPrefix}-message-dialog`;

  const headerWrapper = (
    <MessageDialogHeader className={`${rootClassName}__title`}>
      {icon && <MessageDialogIcon className={`${rootClassName}__icon`}>{icon}</MessageDialogIcon>}
      <MessageDialogTitle>{title}</MessageDialogTitle>
    </MessageDialogHeader>
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
        <MessageDialogContent styleProps={{ icon: !!icon }}>{content}</MessageDialogContent>
      )}
    </Dialog>
  );
};

if (!isProduction) {
  MessageDialog.displayName = displayName;
  MessageDialog.propTypes = {
    visible: Proptypes.bool,
    defaultVisible: Proptypes.bool,
    onVisibleChange: Proptypes.func,
    content: Proptypes.node,
    icon: Proptypes.node,
    title: Proptypes.node,
    className: Proptypes.string,
  };
}

export default MessageDialog;
