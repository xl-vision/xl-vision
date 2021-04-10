import React from 'react';
import Proptypes from 'prop-types';
import usePropChange from '../hooks/usePropChange';
import { isDevelopment } from '../utils/env';
import Dialog, { DialogProps } from './Dialog';

export interface MethodDialogProps extends DialogProps {
  init?: boolean;
}

const MethodDialog = React.forwardRef<HTMLDivElement, MethodDialogProps>((props, ref) => {
  const {
    init = false,
    visible: visibleProp,
    defaultVisible: defaultVisibleProp = true,
    onVisibleChange: onVisibleChangeProp,
    ...others
  } = props;

  const [visible, setVisible] = usePropChange(defaultVisibleProp, visibleProp, onVisibleChangeProp);

  const [first, setFirst] = React.useState(init);

  React.useEffect(() => {
    setFirst(false);
  }, []);

  // eslint-disable-next-line react/jsx-handler-names
  return <Dialog {...others} ref={ref} visible={!first && visible} onVisibleChange={setVisible} />;
});

if (isDevelopment) {
  MethodDialog.displayName = 'MethodDialog';
  MethodDialog.propTypes = {
    visible: Proptypes.bool,
    onVisibleChange: Proptypes.func,
    defaultVisible: Proptypes.bool,
    init: Proptypes.bool,
  };
}

export default MethodDialog;
