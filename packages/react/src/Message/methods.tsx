import ReactDOM from 'react-dom';
import { useEffect } from 'react';
import ThemeProvider, { ThemeProviderProps } from '../ThemeProvider';
import ConfigProvider, { ConfigProviderProps } from '../ConfigProvider';
import useMessage, { MessageHookProps } from './useMessage';

export type MessageMethodProps = MessageHookProps & {
  themeProviderProps?: Omit<ThemeProviderProps, 'children'>;
  configProviderProps?: Omit<ConfigProviderProps, 'children'>;
};

export type MessageMethodUpdate = (
  props: Partial<MessageMethodProps> | ((prev: MessageMethodProps) => Partial<MessageMethodProps>),
) => void;

export type MessageMethodReturnType = {
  destroy: () => void;
  update: MessageMethodUpdate;
  isDestoryed: () => boolean;
};

const destroyFunctions: Array<() => void> = [];

const method = ({
  themeProviderProps,
  configProviderProps,
  onAfterClosed,
  type,
  ...others
}: MessageMethodProps): MessageMethodReturnType => {
  let hookMethods: MessageMethodReturnType | undefined;

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

  const GlobalHookMessage = () => {
    const [methods, holder] = useMessage();

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
    ReactDOM.render(<GlobalHookMessage />, div);
  });

  return {
    destroy: () => hookMethods?.destroy(),
    update: (props) => hookMethods?.update(props),
    isDestoryed: () => hookMethods?.isDestoryed() || false,
  };
};

export const open = (props: MessageMethodProps) => method(props);
export const info = (props: Omit<MessageMethodProps, 'type'>) => method({ ...props, type: 'info' });
export const success = (props: Omit<MessageMethodProps, 'type'>) =>
  method({ ...props, type: 'success' });
export const warning = (props: Omit<MessageMethodProps, 'type'>) =>
  method({ ...props, type: 'warning' });
export const error = (props: Omit<MessageMethodProps, 'type'>) =>
  method({ ...props, type: 'error' });
export const loading = (props: Omit<MessageMethodProps, 'type'>) =>
  method({ ...props, type: 'loading' });

export const destroyAll = () => {
  let fn = destroyFunctions.pop();
  while (fn) {
    fn();
    fn = destroyFunctions.pop();
  }
};
