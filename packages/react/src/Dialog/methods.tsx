import ReactDOM from 'react-dom';
import { createRef, forwardRef, useImperativeHandle, useState } from 'react';
import { isProduction } from '@xl-vision/utils';
import ThemeProvider, { ThemeProviderProps } from '../ThemeProvider';
import ConfigProvider, { ConfigProviderProps } from '../ConfigProvider';
import useDialog, { DialogHookProps } from './useDialog';

export type DialogMethodProps = DialogHookProps & {
  themeProviderProps?: Omit<ThemeProviderProps, 'children'>;
  configProviderProps?: Omit<ConfigProviderProps, 'children'>;
};

export type DialogMethodUpdate = (
  props: Partial<DialogMethodProps> | ((prev: DialogMethodProps) => Partial<DialogMethodProps>),
) => void;

export type DialogMethodReturnType = {
  destroy: () => void;
  update: DialogMethodUpdate;
  isDestoryed: () => boolean;
};

type MethodDialogRef = {
  destroy: () => void;
  isDestoryed: () => boolean;
  update: (updateProps: DialogMethodProps) => void;
};

const createMethodDialog = ({
  configProviderProps,
  themeProviderProps,
  ...others
}: DialogMethodProps) => {
  const MethodDialog = forwardRef<MethodDialogRef>((_, ref) => {
    const [methods, holder] = useDialog();

    const [configProps, setConfigProps] = useState(configProviderProps);
    const [themeProps, setThemeProps] = useState(themeProviderProps);

    const [dialogResult] = useState(() => methods.open(others));

    useImperativeHandle(ref, () => {
      return {
        ...dialogResult,
        update(updateProps) {
          const {
            configProviderProps: newConfigProviderProps,
            themeProviderProps: newThemeProviderProps,
            ...newOthers
          } = updateProps;

          if (newConfigProviderProps) {
            setConfigProps(newConfigProviderProps);
          }

          if (newThemeProviderProps) {
            setThemeProps(newThemeProviderProps);
          }
          dialogResult.update(newOthers);
        },
      };
    });

    return (
      <ConfigProvider {...configProps}>
        <ThemeProvider {...themeProps}>{holder} </ThemeProvider>
      </ConfigProvider>
    );
  });

  if (!isProduction) {
    MethodDialog.displayName = 'MethodDialog';
  }

  return MethodDialog;
};
const destroyFunctions: Array<() => void> = [];

const method = (props: DialogMethodProps): DialogMethodReturnType => {
  let currentProps = {
    ...props,
  };

  const ref = createRef<MethodDialogRef>();

  const Dialog = createMethodDialog({
    ...currentProps,
    onAfterClosed() {
      destroyDOM();
      currentProps.onAfterClosed?.();
    },
  });

  const doDestroy = () => {
    const value = ref.current;
    if (!value) {
      return;
    }
    if (value.isDestoryed()) {
      return;
    }
    value.destroy();
  };

  const div = document.createElement('div');
  document.body.appendChild(div);

  const destroyDOM = () => {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }

    const i = destroyFunctions.indexOf(doDestroy);
    if (i > -1) {
      destroyFunctions.splice(i, 1);
    }
  };

  const render = () => {
    setTimeout(() => {
      ReactDOM.render(<Dialog ref={ref} />, div);
    });
  };

  destroyFunctions.push(doDestroy);

  render();

  return {
    destroy: () => ref.current?.destroy(),
    update: (updateProps) => {
      const parsedProps =
        typeof updateProps === 'function' ? updateProps(currentProps) : updateProps;
      currentProps = {
        ...currentProps,
        ...parsedProps,
      };
      ref.current?.update(currentProps);
    },
    isDestoryed: () => ref.current?.isDestoryed() || false,
  };
};

export const open = (props: DialogMethodProps) => method(props);
export const info = (props: Omit<DialogMethodProps, 'type'>) => method({ ...props, type: 'info' });
export const success = (props: Omit<DialogMethodProps, 'type'>) =>
  method({ ...props, type: 'success' });
export const warning = (props: Omit<DialogMethodProps, 'type'>) =>
  method({ ...props, type: 'warning' });
export const error = (props: Omit<DialogMethodProps, 'type'>) =>
  method({ ...props, type: 'error' });
export const confirm = (props: Omit<DialogMethodProps, 'type'>) =>
  method({ ...props, type: 'confirm' });

export const destroyAll = () => {
  let fn = destroyFunctions.pop();
  while (fn) {
    fn();
    fn = destroyFunctions.pop();
  }
};
