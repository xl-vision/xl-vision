import ReactDOM from 'react-dom';
import { isServer, noop, warning as warningLog } from '@xl-vision/utils';
import createDialog, { DialogType, MethodDialogProps } from './createDialog';
import ThemeProvider, { ThemeProviderProps } from '../ThemeProvider';
import ConfigProvider, { ConfigProviderProps } from '../ConfigProvider';

export type BaseDialogMethodProps = MethodDialogProps & {
  themeProviderProps?: Omit<ThemeProviderProps, 'children'>;
  configProviderProps?: Omit<ConfigProviderProps, 'children'>;
};

export type DialogMethodProps = Omit<BaseDialogMethodProps, 'visible' | 'defaultVisible'>;

export type DialogMethodUpdate = (
  props: Partial<MethodDialogProps> | ((prev: MethodDialogProps) => Partial<MethodDialogProps>),
) => void;

export type DialogMethodReturnType = {
  destroy: () => void;
  update: DialogMethodUpdate;
  isDestoryed: () => boolean;
};

const destroyFunctions: Array<() => void> = [];

const method = (props: DialogMethodProps, type?: DialogType): DialogMethodReturnType => {
  if (isServer) {
    return {
      destroy: noop,
      update: noop,
      isDestoryed: () => false,
    };
  }

  const Dialog = createDialog(type);

  const div = document.createElement('div');
  document.body.appendChild(div);

  let currentProps: BaseDialogMethodProps = {
    ...props,
    visible: undefined,
    defaultVisible: true,
    onAfterClosed: () => {
      props.onAfterClosed?.();
      destroyDOM();
    },
  };

  let destroyState = false;

  const render = (renderProps: BaseDialogMethodProps) => {
    if (destroyState) {
      return warningLog(
        true,
        `The dialog instance was destroyed, please do not update or destroy it again.`,
      );
    }
    const { configProviderProps, themeProviderProps, ...others } = renderProps;

    setTimeout(() => {
      ReactDOM.render(
        <ConfigProvider {...configProviderProps}>
          <ThemeProvider {...themeProviderProps}>
            <Dialog container={null} {...others} />
          </ThemeProvider>
        </ConfigProvider>,
        div,
      );
    });
  };

  const update: DialogMethodUpdate = (updateProps) => {
    const { onAfterClosed, ...otherProps } =
      typeof updateProps === 'function' ? updateProps(currentProps) : updateProps;

    currentProps = {
      ...currentProps,
      ...otherProps,
      visible: undefined,
      defaultVisible: true,
    };

    if (onAfterClosed) {
      currentProps.onAfterClosed = () => {
        onAfterClosed?.();
        destroyDOM();
      };
    }

    render(currentProps);
  };

  const destroyDOM = () => {
    destroyState = true;
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }
    const i = destroyFunctions.indexOf(destroy);
    if (i > -1) {
      destroyFunctions.splice(i, 1);
    }
  };

  const destroy = () => {
    render({
      ...currentProps,
      visible: false,
    });
  };

  destroyFunctions.push(destroy);

  render(currentProps);

  return {
    destroy,
    update,
    isDestoryed: () => destroyState,
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
