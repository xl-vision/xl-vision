import { useValueChange } from '@xl-vision/hooks';
import { CSSObject } from '@xl-vision/styled-engine';
import { isProduction } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import { ReactNode, FC, useState, useEffect } from 'react';
import { styled } from '../../styles';
import Dialog, { DialogProps } from '../Dialog';

export interface InnerDedicatedDialogProps extends Omit<DialogProps, 'children' | 'content'> {
  content?: ReactNode;
  icon?: ReactNode;
}

const displayName = 'InnerDedicatedDialog';

const InnerDedicatedDialogRoot = styled(Dialog, {
  name: displayName,
  slot: 'Root',
})(() => {
  return {};
});

const InnerDedicatedDialogHeader = styled('h6', {
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

const InnerDedicatedDialogIcon = styled('span', {
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

const InnerDedicatedDialogTitle = styled('span', {
  name: displayName,
  slot: 'Title',
})(() => {
  return {
    verticalAlign: 'middle',
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
    ...others
  } = props;

  const [open, handleOpenChange] = useValueChange(defaultOpen, openProp, onOpenChange);

  const [first, setFirst] = useState(true);

  // 保证有对话框弹出的动画效果
  useEffect(() => {
    setFirst(false);
  }, []);

  const headerWrapper = (
    <InnerDedicatedDialogHeader>
      {icon && <InnerDedicatedDialogIcon>{icon}</InnerDedicatedDialogIcon>}
      <InnerDedicatedDialogTitle>{title}</InnerDedicatedDialogTitle>
    </InnerDedicatedDialogHeader>
  );

  return (
    <InnerDedicatedDialogRoot
      {...others}
      open={!first && open}
      title={headerWrapper}
      onOpenChange={handleOpenChange}
    >
      {content && (
        <InnerDedicatedDialogContent styleProps={{ icon: !!icon }}>
          {content}
        </InnerDedicatedDialogContent>
      )}
    </InnerDedicatedDialogRoot>
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
