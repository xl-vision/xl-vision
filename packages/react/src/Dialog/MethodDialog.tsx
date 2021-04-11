import React from 'react';
import Proptypes from 'prop-types';
import clsx from 'clsx';
import { CSSObject } from '@xl-vision/styled-engine-types';
import usePropChange from '../hooks/usePropChange';
import { isDevelopment } from '../utils/env';
import Dialog, { DialogProps } from './Dialog';
import { styled } from '../styles';
import ThemeContext from '../ThemeProvider/ThemeContext';

export interface MethodDialogProps extends Omit<DialogProps, 'children'> {
  content?: React.ReactNode;
  icon?: React.ReactNode;
}

const displayName = 'MethodDialog';

const MethodDialogTitle = styled('h6', {
  name: displayName,
  slot: 'Title',
})(({ theme }) => {
  const { typography } = theme;

  return {
    ...typography.h6,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
  };
});

const MethodDialogIcon = styled('span', {
  name: displayName,
  slot: 'Icon',
})(() => {
  return {
    lineHeight: 1,
    paddingRight: 5,
    svg: {
      verticalAlign: 'middle',
    },
  };
});

export type MethodDialogContentStyleProps = {
  icon: boolean;
};

const MethodDialogContent = styled('div', {
  name: displayName,
  slot: 'Content',
})<MethodDialogContentStyleProps>(({ styleProps }) => {
  const { icon } = styleProps;
  const styles: CSSObject = {};

  if (icon) {
    styles.paddingLeft = 25;
  }

  return styles;
});

const MethodDialog = React.forwardRef<HTMLDivElement, MethodDialogProps>((props, ref) => {
  const {
    visible: visibleProp,
    defaultVisible: defaultVisibleProp = true,
    onVisibleChange: onVisibleChangeProp,
    content,
    icon,
    title,
    className,
    ...others
  } = props;

  const [visible, setVisible] = usePropChange(defaultVisibleProp, visibleProp, onVisibleChangeProp);

  const [first, setFirst] = React.useState(true);

  const { clsPrefix } = React.useContext(ThemeContext);

  React.useEffect(() => {
    setFirst(false);
  }, []);

  const rootClassName = `${clsPrefix}-method-dialog`;

  const titleWrapper = (
    <MethodDialogTitle className={`${rootClassName}__title`}>
      {icon && <MethodDialogIcon className={`${rootClassName}__icon`}>{icon}</MethodDialogIcon>}
      {title}
    </MethodDialogTitle>
  );

  return (
    <Dialog
      {...others}
      className={clsx(className, rootClassName)}
      title={titleWrapper}
      ref={ref}
      visible={!first && visible}
      // eslint-disable-next-line react/jsx-handler-names
      onVisibleChange={setVisible}
    >
      {content && (
        <MethodDialogContent styleProps={{ icon: !!icon }}>{content}</MethodDialogContent>
      )}
    </Dialog>
  );
});

if (isDevelopment) {
  MethodDialog.displayName = displayName;
  MethodDialog.propTypes = {
    visible: Proptypes.bool,
    onVisibleChange: Proptypes.func,
    defaultVisible: Proptypes.bool,
    content: Proptypes.node,
    icon: Proptypes.node,
    title: Proptypes.node,
    className: Proptypes.string,
  };
}

export default MethodDialog;
