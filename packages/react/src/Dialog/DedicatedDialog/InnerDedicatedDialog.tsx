import { useValueChange } from '@xl-vision/hooks';
import { isProduction } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import { ReactNode, FC, useState, useEffect } from 'react';
import memoStyled from '../../memoStyled';
import Dialog, { DialogProps } from '../Dialog';

export interface InnerDedicatedDialogProps extends Omit<DialogProps, 'children' | 'content'> {
  content?: ReactNode;
  icon?: ReactNode;
}

const displayName = 'InnerDedicatedDialog';

const InnerDedicatedDialogRoot = memoStyled(Dialog, {
  name: displayName,
  slot: 'Root',
})(() => {
  return {};
});

const InnerDedicatedDialogHeader = memoStyled('h6', {
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

const InnerDedicatedDialogIcon = memoStyled('span', {
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

const InnerDedicatedDialogTitle = memoStyled('span', {
  name: displayName,
  slot: 'Title',
})(() => {
  return {
    verticalAlign: 'middle',
  };
});

const InnerDedicatedDialogContent = memoStyled('div', {
  name: displayName,
  slot: 'Content',
})<{
  icon: boolean;
}>(() => {
  return {
    variants: [
      {
        props: {
          icon: true,
        },
        style: {
          paddingLeft: 25,
        },
      },
    ],
  };
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
