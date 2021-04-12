import React from 'react';
import useEventCallback from '../hooks/useEventCallback';
import { LocalizationContext } from '../LocalizationProvider';
import { ThemeContext } from '../ThemeProvider';
import {
  error,
  info,
  method,
  MethodDialogFunctionProps,
  success,
  warning,
  confirm,
} from './methods';

export type MethodDialogHookProps = Omit<
  MethodDialogFunctionProps,
  'themeContext' | 'localeContext'
>;

export default () => {
  const defaultThemeContext = React.useContext(ThemeContext);
  const defaultLocaleContext = React.useContext(LocalizationContext);

  const modals = React.useRef<
    Array<{ destroy: () => void; update: (props: Partial<MethodDialogHookProps>) => void }>
  >([]);

  React.useEffect(() => {
    return () => {
      modals.current.forEach((it) => it.destroy());
    };
  }, []);

  React.useEffect(() => {
    // 全局context修改，这里要更新
    modals.current.forEach((it) => it.update({}));
  }, [defaultThemeContext, defaultLocaleContext]);

  const methodWrapper = useEventCallback((props: MethodDialogHookProps) => {
    const { update, destroy } = method({
      ...props,
      themeContext: defaultThemeContext,
      localeContext: defaultLocaleContext,
    });

    const destroyWrapper = () => {
      modals.current = modals.current.filter((it) => it !== ret);
      destroy();
    };

    const updateWrapper = (_props: Partial<MethodDialogHookProps>) => {
      update({ ..._props, themeContext: defaultThemeContext, localeContext: defaultLocaleContext });
    };

    const ret = {
      update: updateWrapper,
      destroy: destroyWrapper,
    };

    modals.current.push(ret);

    return ret;
  });

  const infoWrapper = useEventCallback((props: MethodDialogHookProps) => {
    const { update, destroy } = info({
      ...props,
      themeContext: defaultThemeContext,
      localeContext: defaultLocaleContext,
    });

    const destroyWrapper = () => {
      modals.current = modals.current.filter((it) => it !== ret);
      destroy();
    };

    const updateWrapper = (_props: Partial<MethodDialogHookProps>) => {
      console.log(defaultLocaleContext);
      update({ ..._props, themeContext: defaultThemeContext, localeContext: defaultLocaleContext });
    };

    const ret = {
      update: updateWrapper,
      destroy: destroyWrapper,
    };

    modals.current.push(ret);

    return ret;
  });

  const successWrapper = useEventCallback((props: MethodDialogHookProps) => {
    const { update, destroy } = success({
      ...props,
      themeContext: defaultThemeContext,
      localeContext: defaultLocaleContext,
    });

    const destroyWrapper = () => {
      modals.current = modals.current.filter((it) => it !== ret);
      destroy();
    };

    const updateWrapper = (_props: Partial<MethodDialogHookProps>) => {
      update({ ..._props, themeContext: defaultThemeContext, localeContext: defaultLocaleContext });
    };

    const ret = {
      update: updateWrapper,
      destroy: destroyWrapper,
    };

    modals.current.push(ret);

    return ret;
  });

  const errorWrapper = useEventCallback((props: MethodDialogHookProps) => {
    const { update, destroy } = error({
      ...props,
      themeContext: defaultThemeContext,
      localeContext: defaultLocaleContext,
    });

    const destroyWrapper = () => {
      modals.current = modals.current.filter((it) => it !== ret);
      destroy();
    };

    const updateWrapper = (_props: Partial<MethodDialogHookProps>) => {
      update({ ..._props, themeContext: defaultThemeContext, localeContext: defaultLocaleContext });
    };

    const ret = {
      update: updateWrapper,
      destroy: destroyWrapper,
    };

    modals.current.push(ret);

    return ret;
  });

  const warningWrapper = useEventCallback((props: MethodDialogHookProps) => {
    const { update, destroy } = warning({
      ...props,
      themeContext: defaultThemeContext,
      localeContext: defaultLocaleContext,
    });

    const destroyWrapper = () => {
      modals.current = modals.current.filter((it) => it !== ret);
      destroy();
    };

    const updateWrapper = (_props: Partial<MethodDialogHookProps>) => {
      update({ ..._props, themeContext: defaultThemeContext, localeContext: defaultLocaleContext });
    };

    const ret = {
      update: updateWrapper,
      destroy: destroyWrapper,
    };

    modals.current.push(ret);

    return ret;
  });

  const confirmWrapper = useEventCallback((props: MethodDialogHookProps) => {
    const { update, destroy } = confirm({
      ...props,
      themeContext: defaultThemeContext,
      localeContext: defaultLocaleContext,
    });

    const destroyWrapper = () => {
      modals.current = modals.current.filter((it) => it !== ret);
      destroy();
    };

    const updateWrapper = (_props: Partial<MethodDialogHookProps>) => {
      update({ ..._props, themeContext: defaultThemeContext, localeContext: defaultLocaleContext });
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
