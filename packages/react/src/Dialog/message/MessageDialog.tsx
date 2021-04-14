import React from 'react';
import Proptypes from 'prop-types';
import clsx from 'clsx';
import { CSSObject } from '@xl-vision/styled-engine-types';
import { ThemeContext as StyledThemeContext } from '@xl-vision/styled-engine';
import { isDevelopment } from '../../utils/env';
import Dialog, { DialogProps } from '../Dialog';
import { styled } from '../../styles';
import { LocalizationContext, LocalizationContextProps } from '../../LocalizationProvider';
import { Theme, ThemeContext } from '../../ThemeProvider';
import usePropChange from '../../hooks/usePropChange';

export interface MessageDialogProps extends Omit<DialogProps, 'children'> {
  content?: React.ReactNode;
  icon?: React.ReactNode;
  localeContext: LocalizationContextProps;
  themeContext: Theme;
}

const displayName = 'MessageDialog';

const MessageDialogHeader = styled('h6', {
  name: displayName,
  slot: 'Header',
})(({ theme }) => {
  const { typography } = theme;

  return {
    ...typography.h6,
    margin: 0,
    display: 'flex',
    alignItems: 'flex-start',
    // alignItems: 'center',
  };
});

const MessageDialogTitle = styled('span', {
  name: displayName,
  slot: 'Title',
})(() => {
  return {
    display: 'inline-block',
    // display: 'flex',
    // alignItems: 'center',
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

export type MessageDialogRef = {
  visible: boolean;
};

const MessageDialog = React.forwardRef<MessageDialogRef, MessageDialogProps>((props, ref) => {
  const {
    localeContext,
    themeContext,
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

  const [first, setFirst] = React.useState(true);

  const { clsPrefix } = React.useContext(ThemeContext);

  React.useImperativeHandle(ref, () => {
    return {
      visible,
    };
  });

  // 保证有对话框弹出的动画效果
  React.useEffect(() => {
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
    <LocalizationContext.Provider value={localeContext}>
      <ThemeContext.Provider value={themeContext}>
        <StyledThemeContext.Provider value={themeContext}>
          <Dialog
            {...others}
            className={clsx(className, rootClassName)}
            title={headerWrapper}
            visible={!first && visible}
            onVisibleChange={handleVisibleChange}
          >
            {content && (
              <MessageDialogContent styleProps={{ icon: !!icon }}>{content}</MessageDialogContent>
            )}
          </Dialog>
        </StyledThemeContext.Provider>
      </ThemeContext.Provider>
    </LocalizationContext.Provider>
  );
});

if (isDevelopment) {
  MessageDialog.displayName = displayName;
  MessageDialog.propTypes = {
    themeContext: Proptypes.any.isRequired,
    localeContext: Proptypes.any.isRequired,
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
