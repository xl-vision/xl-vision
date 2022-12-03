import ReactDOM from 'react-dom';
import { useEffect } from 'react';
import ThemeProvider, { ThemeProviderProps } from '../ThemeProvider';
import ConfigProvider, { ConfigProviderProps } from '../ConfigProvider';
import useDialog, { DialogHookProps } from './useDialog';
import { DialogType } from './MethodDialog';

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

const method = (
  { themeProviderProps, configProviderProps, onAfterClosed, ...others }: DialogMethodProps,
  dialogType?: DialogType,
): DialogMethodReturnType => {
  let hookMethods: DialogMethodReturnType | undefined;

  const div = document.createElement('div');
  document.body.appendChild(div);

  const doDestroy = () => {
    if (!hookMethods) {
      return;
    }
    if (!hookMethods.isDestoryed) {
      return;
    }
    hookMethods.destroy();
  };

  const onAfterClosedWrap = () => {
    onAfterClosed?.();
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }

    const i = destroyFunctions.indexOf(doDestroy);
    if (i > -1) {
      destroyFunctions.splice(i, 1);
    }
  };

  const GlobalHookDialog = () => {
    const [methods, holder] = useDialog();

    useEffect(() => {
      hookMethods = methods[dialogType || 'open']({ ...others, onAfterClosed: onAfterClosedWrap });
    }, [methods]);

    return (
      <ConfigProvider {...configProviderProps}>
        <ThemeProvider {...themeProviderProps}>{holder} </ThemeProvider>
      </ConfigProvider>
    );
  };

  destroyFunctions.push(doDestroy);

  setTimeout(() => {
    ReactDOM.render(<GlobalHookDialog />, div);
  });

  return {
    destroy: () => hookMethods?.destroy(),
    update: (props) => hookMethods?.update(props),
    isDestoryed: () => hookMethods?.isDestoryed() || false,
  };
};

export const open = (props: DialogMethodProps) => method(props);
export const info = (props: DialogMethodProps) => method(props, 'info');
export const success = (props: DialogMethodProps) => method(props, 'success');
export const warning = (props: DialogMethodProps) => method(props, 'warning');
export const error = (props: DialogMethodProps) => method(props, 'error');
export const confirm = (props: DialogMethodProps) => method(props, 'confirm');

export const destroyAll = () => {
  let fn = destroyFunctions.pop();
  while (fn) {
    fn();
    fn = destroyFunctions.pop();
  }
};
