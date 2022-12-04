import ReactDOM from 'react-dom';
import { useEffect } from 'react';
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

const method = ({
  themeProviderProps,
  configProviderProps,
  onAfterClosed,
  type,
  ...others
}: DialogMethodProps): DialogMethodReturnType => {
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
      hookMethods = methods[type || 'open']({ ...others, onAfterClosed: onAfterClosedWrap });
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
