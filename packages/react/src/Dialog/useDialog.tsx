import React from 'react';
import useEventCallback from '../hooks/useEventCallback';
import { LocalizationContext } from '../LocalizationProvider';
import { ThemeContext } from '../ThemeProvider';
import { MessageDialogProps } from './message/MessageDialog';
import { error, info, method, success, warning, confirm } from './methods';

export type MessageDialogHooksProps = Omit<MessageDialogProps, 'themeContext' | 'localeContext'>;

export default () => {
  const defaultThemeContext = React.useContext(ThemeContext);
  const defaultLocaleContext = React.useContext(LocalizationContext);

  const defaultThemeContextRef = React.useRef(defaultThemeContext);
  const defaultLocaleContextRef = React.useRef(defaultLocaleContext);

  const modals = React.useRef<
    Array<{ destroy: () => void; update: (props: Partial<MessageDialogHooksProps>) => void }>
  >([]);

  React.useEffect(() => {
    return () => {
      modals.current.forEach((it) => it.destroy());
    };
  }, []);

  React.useEffect(() => {
    defaultThemeContextRef.current = defaultThemeContext;
    defaultLocaleContextRef.current = defaultLocaleContext;
    // 全局context修改，这里要更新
    modals.current.forEach((it) => it.update({}));
  }, [defaultThemeContext, defaultLocaleContext]);

  const methodWrapper = useEventCallback((props: MessageDialogHooksProps) => {
    const { update, destroy } = method({
      ...props,
      themeContext: defaultThemeContextRef.current,
      localeContext: defaultLocaleContextRef.current,
    });

    const destroyWrapper = () => {
      modals.current = modals.current.filter((it) => it !== ret);
      destroy();
    };

    const updateWrapper = (
      _props:
        | Partial<MessageDialogHooksProps>
        | ((prev: MessageDialogHooksProps) => Partial<MessageDialogHooksProps>),
    ) => {
      update((prev) => ({
        ...(typeof _props === 'function' ? _props(prev) : _props),
        themeContext: defaultThemeContextRef.current,
        localeContext: defaultLocaleContextRef.current,
      }));
    };

    const ret = {
      update: updateWrapper,
      destroy: destroyWrapper,
    };

    modals.current.push(ret);

    return ret;
  });

  const infoWrapper = useEventCallback((props: MessageDialogHooksProps) => {
    const { update, destroy } = info({
      ...props,
      themeContext: defaultThemeContextRef.current,
      localeContext: defaultLocaleContextRef.current,
    });

    const destroyWrapper = () => {
      modals.current = modals.current.filter((it) => it !== ret);
      destroy();
    };

    const updateWrapper = (
      _props:
        | Partial<MessageDialogHooksProps>
        | ((prev: MessageDialogHooksProps) => Partial<MessageDialogHooksProps>),
    ) => {
      update((prev) => ({
        ...(typeof _props === 'function' ? _props(prev) : _props),
        themeContext: defaultThemeContextRef.current,
        localeContext: defaultLocaleContextRef.current,
      }));
    };

    const ret = {
      update: updateWrapper,
      destroy: destroyWrapper,
    };

    modals.current.push(ret);

    return ret;
  });

  const successWrapper = useEventCallback((props: MessageDialogHooksProps) => {
    const { update, destroy } = success({
      ...props,
      themeContext: defaultThemeContextRef.current,
      localeContext: defaultLocaleContextRef.current,
    });

    const destroyWrapper = () => {
      modals.current = modals.current.filter((it) => it !== ret);
      destroy();
    };

    const updateWrapper = (
      _props:
        | Partial<MessageDialogHooksProps>
        | ((prev: MessageDialogHooksProps) => Partial<MessageDialogHooksProps>),
    ) => {
      update((prev) => ({
        ...(typeof _props === 'function' ? _props(prev) : _props),
        themeContext: defaultThemeContextRef.current,
        localeContext: defaultLocaleContextRef.current,
      }));
    };

    const ret = {
      update: updateWrapper,
      destroy: destroyWrapper,
    };

    modals.current.push(ret);

    return ret;
  });

  const errorWrapper = useEventCallback((props: MessageDialogHooksProps) => {
    const { update, destroy } = error({
      ...props,
      themeContext: defaultThemeContextRef.current,
      localeContext: defaultLocaleContextRef.current,
    });

    const destroyWrapper = () => {
      modals.current = modals.current.filter((it) => it !== ret);
      destroy();
    };

    const updateWrapper = (
      _props:
        | Partial<MessageDialogHooksProps>
        | ((prev: MessageDialogHooksProps) => Partial<MessageDialogHooksProps>),
    ) => {
      update((prev) => ({
        ...(typeof _props === 'function' ? _props(prev) : _props),
        themeContext: defaultThemeContextRef.current,
        localeContext: defaultLocaleContextRef.current,
      }));
    };

    const ret = {
      update: updateWrapper,
      destroy: destroyWrapper,
    };

    modals.current.push(ret);

    return ret;
  });

  const warningWrapper = useEventCallback((props: MessageDialogHooksProps) => {
    const { update, destroy } = warning({
      ...props,
      themeContext: defaultThemeContextRef.current,
      localeContext: defaultLocaleContextRef.current,
    });

    const destroyWrapper = () => {
      modals.current = modals.current.filter((it) => it !== ret);
      destroy();
    };

    const updateWrapper = (
      _props:
        | Partial<MessageDialogHooksProps>
        | ((prev: MessageDialogHooksProps) => Partial<MessageDialogHooksProps>),
    ) => {
      update((prev) => ({
        ...(typeof _props === 'function' ? _props(prev) : _props),
        themeContext: defaultThemeContextRef.current,
        localeContext: defaultLocaleContextRef.current,
      }));
    };

    const ret = {
      update: updateWrapper,
      destroy: destroyWrapper,
    };

    modals.current.push(ret);

    return ret;
  });

  const confirmWrapper = useEventCallback((props: MessageDialogHooksProps) => {
    const { update, destroy } = confirm({
      ...props,
      themeContext: defaultThemeContextRef.current,
      localeContext: defaultLocaleContextRef.current,
    });

    const destroyWrapper = () => {
      modals.current = modals.current.filter((it) => it !== ret);
      destroy();
    };

    const updateWrapper = (
      _props:
        | Partial<MessageDialogHooksProps>
        | ((prev: MessageDialogHooksProps) => Partial<MessageDialogHooksProps>),
    ) => {
      update((prev) => ({
        ...(typeof _props === 'function' ? _props(prev) : _props),
        themeContext: defaultThemeContextRef.current,
        localeContext: defaultLocaleContextRef.current,
      }));
    };

    const ret = {
      update: updateWrapper,
      destroy: destroyWrapper,
    };

    modals.current.push(ret);

    return ret;
  });

  return React.useMemo(
    () => ({
      method: methodWrapper,
      info: infoWrapper,
      success: successWrapper,
      error: errorWrapper,
      warning: warningWrapper,
      confirm: confirmWrapper,
    }),
    [methodWrapper, infoWrapper, successWrapper, errorWrapper, warningWrapper, confirmWrapper],
  );
};
