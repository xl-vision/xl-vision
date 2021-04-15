import React from 'react';
import useEventCallback from '../hooks/useEventCallback';
import { LocalizationContext } from '../LocalizationProvider';
import { ThemeContext } from '../ThemeProvider';
import message from './message';
import { MessageDialogType } from './message/createMessageDialog';
import { MethodDialogFunctionProps } from './methods';

export default () => {
  const defaultThemeContext = React.useContext(ThemeContext);
  const defaultLocalizationContext = React.useContext(LocalizationContext);

  const defaultThemeContextRef = React.useRef(defaultThemeContext);
  const defaultLocalizationContextRef = React.useRef(defaultLocalizationContext);

  const modals = React.useRef<
    Array<{ destroy: () => void; update: (props: Partial<MethodDialogFunctionProps>) => void }>
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

  const method = useEventCallback((props: MethodDialogFunctionProps, type?: MessageDialogType) => {
    const createHandleClosed = (onClosed?: (isDestory?: true) => void) => (isDestroy?: true) => {
      onClosed?.(isDestroy);
      modals.current = modals.current.filter((it) => it !== ret);
      if (isDestroy) {
        return;
      }
      destroy();
    };
    const { update, destroy } = message(
      {
        ...props,
        themeContext: defaultThemeContextRef.current,
        localizationContext: defaultLocalizationContextRef.current,
        defaultVisible: true,
        visible: undefined,
        onClosed: createHandleClosed(props.onClosed),
      },
      type,
    );

    const destroyWrapper = () => {
      modals.current = modals.current.filter((it) => it !== ret);
      destroy();
    };

    const updateWrapper = (
      updateProps:
        | Partial<MethodDialogFunctionProps>
        | ((prev: MethodDialogFunctionProps) => Partial<MethodDialogFunctionProps>),
    ) => {
      update((prev) => {
        const newProps = typeof updateProps === 'function' ? updateProps(prev) : updateProps;
        return {
          ...newProps,
          themeContext: defaultThemeContextRef.current,
          localizationContext: defaultLocalizationContextRef.current,
          defaultVisible: true,
          visible: undefined,
          onClosed: createHandleClosed(newProps.onClosed),
        };
      });
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
      open: (props: MethodDialogFunctionProps) => method(props),
      confirm: (props: MethodDialogFunctionProps) => method(props, 'confirm'),
      error: (props: MethodDialogFunctionProps) => method(props, 'error'),
      info: (props: MethodDialogFunctionProps) => method(props, 'info'),
      success: (props: MethodDialogFunctionProps) => method(props, 'success'),
      warning: (props: MethodDialogFunctionProps) => method(props, 'warning'),
    }),
    [method],
  );
};
