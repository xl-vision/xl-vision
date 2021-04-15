import React from 'react';
import useEventCallback from '../hooks/useEventCallback';
import { LocalizationContext } from '../LocalizationProvider';
import { ThemeContext } from '../ThemeProvider';
import message, { MessageDialogFunctionProps } from './message';
import { MessageDialogType } from './message/createMessageDialog';

export interface MessageDialogHooksProps
  extends Omit<MessageDialogFunctionProps, 'localizationContext' | 'themeContext'> {}

export default () => {
  const defaultThemeContext = React.useContext(ThemeContext);
  const defaultLocalizationContext = React.useContext(LocalizationContext);

  const defaultThemeContextRef = React.useRef(defaultThemeContext);
  const defaultLocalizationContextRef = React.useRef(defaultLocalizationContext);

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
    defaultLocalizationContextRef.current = defaultLocalizationContext;
    // 全局context修改，这里要更新
    modals.current.forEach((it) => it.update({}));
  }, [defaultThemeContext, defaultLocalizationContext]);

  const method = useEventCallback((props: MessageDialogHooksProps, type?: MessageDialogType) => {
    const { update, destroy } = message(
      {
        defaultVisible: true,
        ...props,
        themeContext: defaultThemeContextRef.current,
        localizationContext: defaultLocalizationContextRef.current,
      },
      type,
    );

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
        localizationContext: defaultLocalizationContextRef.current,
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
      open: (props: MessageDialogHooksProps) => method(props),
      confirm: (props: MessageDialogHooksProps) => method(props, 'confirm'),
      error: (props: MessageDialogHooksProps) => method(props, 'error'),
      info: (props: MessageDialogHooksProps) => method(props, 'info'),
      success: (props: MessageDialogHooksProps) => method(props, 'success'),
      warning: (props: MessageDialogHooksProps) => method(props, 'warning'),
    }),
    [method],
  );
};
