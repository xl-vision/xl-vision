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

export default () => {
  const defaultThemeContext = React.useContext(ThemeContext);
  const defaultLocaleContext = React.useContext(LocalizationContext);

  const destroyFunctions = React.useRef<Array<() => void>>([]);

  React.useEffect(() => {
    return () => {
      destroyFunctions.current.forEach((it) => it());
    };
  }, []);

  const methodWrapper = useEventCallback((props: MethodDialogFunctionProps) => {
    const {
      themeContext = defaultThemeContext,
      localeContext = defaultLocaleContext,
      ...others
    } = props;

    const { update, destroy } = method({
      themeContext,
      localeContext,
      ...others,
    });

    const destroyWrapper = () => {
      destroyFunctions.current = destroyFunctions.current.filter((it) => it !== destroyWrapper);
      destroy();
    };

    destroyFunctions.current.push(destroyWrapper);

    return {
      update,
      destory: destroyWrapper,
    };
  });

  const infoWrapper = useEventCallback((props: MethodDialogFunctionProps) => {
    const {
      themeContext = defaultThemeContext,
      localeContext = defaultLocaleContext,
      ...others
    } = props;

    const { update, destroy } = info({
      themeContext,
      localeContext,
      ...others,
    });

    const destroyWrapper = () => {
      destroyFunctions.current = destroyFunctions.current.filter((it) => it !== destroyWrapper);
      destroy();
    };

    destroyFunctions.current.push(destroyWrapper);

    return {
      update,
      destory: destroyWrapper,
    };
  });

  const successWrapper = useEventCallback((props: MethodDialogFunctionProps) => {
    const {
      themeContext = defaultThemeContext,
      localeContext = defaultLocaleContext,
      ...others
    } = props;

    const { update, destroy } = success({
      themeContext,
      localeContext,
      ...others,
    });

    const destroyWrapper = () => {
      destroyFunctions.current = destroyFunctions.current.filter((it) => it !== destroyWrapper);
      destroy();
    };

    destroyFunctions.current.push(destroyWrapper);

    return {
      update,
      destory: destroyWrapper,
    };
  });

  const errorWrapper = useEventCallback((props: MethodDialogFunctionProps) => {
    const {
      themeContext = defaultThemeContext,
      localeContext = defaultLocaleContext,
      ...others
    } = props;

    const { update, destroy } = error({
      themeContext,
      localeContext,
      ...others,
    });

    const destroyWrapper = () => {
      destroyFunctions.current = destroyFunctions.current.filter((it) => it !== destroyWrapper);
      destroy();
    };

    destroyFunctions.current.push(destroyWrapper);

    return {
      update,
      destory: destroyWrapper,
    };
  });

  const warningWrapper = useEventCallback((props: MethodDialogFunctionProps) => {
    const {
      themeContext = defaultThemeContext,
      localeContext = defaultLocaleContext,
      ...others
    } = props;

    const { update, destroy } = warning({
      themeContext,
      localeContext,
      ...others,
    });

    const destroyWrapper = () => {
      destroyFunctions.current = destroyFunctions.current.filter((it) => it !== destroyWrapper);
      destroy();
    };

    destroyFunctions.current.push(destroyWrapper);

    return {
      update,
      destory: destroyWrapper,
    };
  });

  const confirmWrapper = useEventCallback((props: MethodDialogFunctionProps) => {
    const {
      themeContext = defaultThemeContext,
      localeContext = defaultLocaleContext,
      ...others
    } = props;

    const { update, destroy } = confirm({
      themeContext,
      localeContext,
      ...others,
    });

    const destroyWrapper = () => {
      destroyFunctions.current = destroyFunctions.current.filter((it) => it !== destroyWrapper);
      destroy();
    };

    destroyFunctions.current.push(destroyWrapper);

    return {
      update,
      destory: destroyWrapper,
    };
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
