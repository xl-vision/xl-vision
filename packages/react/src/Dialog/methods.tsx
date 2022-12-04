import ReactDOM from 'react-dom';
import { useEffect, useState } from 'react';
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

const destroyFunctions: Array<() => void> = [];

const method = (props: DialogMethodProps): DialogMethodReturnType => {
  let currentProps = {
    ...props,
  };

  let hookMethods: DialogMethodReturnType | undefined;

  const div = document.createElement('div');
  document.body.appendChild(div);

  const doDestroy = () => {
    if (!hookMethods) {
      return;
    }
    if (hookMethods.isDestoryed()) {
      return;
    }
    hookMethods.destroy();
  };

  const onAfterClosedWrap = (closed?: () => void) => () => {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }

    const i = destroyFunctions.indexOf(doDestroy);
    if (i > -1) {
      destroyFunctions.splice(i, 1);
    }
    closed?.();
  };

  const GlobalHookDialog = () => {
    const [configProps, setConfigProps] = useState(currentProps.configProviderProps);
    const [themeProps, setThemeProps] = useState(currentProps.themeProviderProps);

    const [methods, holder] = useDialog();

    useEffect(() => {
      const {
        type,
        onAfterClosed,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        configProviderProps: _1,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        themeProviderProps: _2,
        ...others
      } = currentProps;

      const result = methods[type || 'open']({
        ...others,
        onAfterClosed: onAfterClosedWrap(onAfterClosed),
      });

      hookMethods = {
        destroy: result.destroy,
        isDestoryed: result.isDestoryed,
        update(updateProps) {
          const newProps =
            typeof updateProps === 'function' ? updateProps(currentProps) : updateProps;

          currentProps = {
            ...currentProps,
            ...newProps,
          };

          const {
            onAfterClosed: newOnAfterClosed,
            configProviderProps: newConfigProviderProps,
            themeProviderProps: newThemeProviderProps,
            ...newOthers
          } = currentProps;

          if (newConfigProviderProps) {
            setConfigProps(newConfigProviderProps);
          }

          if (newThemeProviderProps) {
            setThemeProps(newThemeProviderProps);
          }

          result.update({ ...newOthers, onAfterClosed: onAfterClosedWrap(newOnAfterClosed) });
        },
      };
    }, [methods]);

    return (
      <ConfigProvider {...configProps}>
        <ThemeProvider {...themeProps}>{holder} </ThemeProvider>
      </ConfigProvider>
    );
  };

  destroyFunctions.push(doDestroy);

  setTimeout(() => {
    ReactDOM.render(<GlobalHookDialog />, div);
  });

  return {
    destroy: () => hookMethods?.destroy(),
    update: (updateProps) => hookMethods?.update(updateProps),
    isDestoryed: () => hookMethods?.isDestoryed() || false,
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
