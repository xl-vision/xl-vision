import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from '@xl-vision/icons';
import React from 'react';
import ReactDOM from 'react-dom';
import Icon from '../Icon';
import { defaultLanguage, locales } from '../locale';
import { LocalizationContextProps } from '../LocalizationProvider';
import { Theme } from '../ThemeProvider';
import defaultTheme from '../ThemeProvider/defaultTheme';
import { isServer } from '../utils/env';
import { voidFn } from '../utils/function';
import MethodDialog, { MethodDialogProps } from './MethodDialog';

let destoryFunctions: Array<() => void> = [];

export interface MethodDialogFunctionProps
  extends Omit<MethodDialogProps, 'themeContext' | 'localeContext'> {
  localeContext?: LocalizationContextProps;
  themeContext?: Theme;
}

export type DialogMethodReturnType = {
  destroy: () => void;
  update: (
    props:
      | Partial<MethodDialogFunctionProps>
      | ((prev: MethodDialogFunctionProps) => Partial<MethodDialogFunctionProps>),
  ) => void;
};

const defaultLocaleContext: LocalizationContextProps = {
  locale: locales[defaultLanguage],
  language: defaultLanguage,
};
const defaultThemeContext = defaultTheme;

export const method = (props: MethodDialogFunctionProps): DialogMethodReturnType => {
  if (isServer) {
    return {
      destroy: voidFn,
      update: voidFn,
    };
  }

  const div = document.createElement('div');
  document.body.appendChild(div);

  let currentProps = props;

  const handleVisibleChange = (visible: boolean) => {
    // 如果visible!=undefined，内部状态完全由外部决定，不需要设置回来
    if (currentProps.visible === undefined) {
      currentProps.visible = visible;
    }
    currentProps.onVisibleChange?.(visible);
  };

  const render = () => {
    setTimeout(() => {
      const {
        localeContext = defaultLocaleContext,
        themeContext = defaultThemeContext,
        ...others
      } = currentProps;

      ReactDOM.render(
        <MethodDialog
          getContainer={null}
          localeContext={localeContext}
          themeContext={themeContext}
          {...others}
          onVisibleChange={handleVisibleChange}
        />,
        div,
      );
    });
  };

  const update = (
    renderProps:
      | Partial<MethodDialogFunctionProps>
      | ((prev: MethodDialogFunctionProps) => Partial<MethodDialogFunctionProps>),
  ) => {
    const newProps = typeof renderProps === 'function' ? renderProps(currentProps) : renderProps;
    currentProps = { ...currentProps, ...newProps };
    render();
  };

  const destroyDOM = () => {
    destoryFunctions = destoryFunctions.filter((it) => it !== destroy);
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }
  };

  const destroy = () => {
    if (currentProps.visible) {
      destroyDOM();
      return;
    }

    if (currentProps.defaultVisible && currentProps.visible === undefined) {
      destroyDOM();
      return;
    }

    update({
      visible: false,
      onClosed: () => {
        currentProps?.onClosed?.();
        destroyDOM();
      },
    });
  };

  destoryFunctions.push(destroy);

  render();

  return {
    destroy,
    update,
  };
};

export const destroyAll = () => {
  let fn = destoryFunctions.pop();

  while (fn) {
    fn();
    fn = destoryFunctions.pop();
  }
};

export const info = (props: MethodDialogFunctionProps): DialogMethodReturnType => {
  const {
    themeContext = defaultThemeContext,
    localeContext = defaultLocaleContext,
    onClosed,
    ...others
  } = props;

  const onClosedWrapper = () => {
    onClosed?.();
    destroy();
  };

  const { destroy, update } = method({
    icon: (
      <Icon style={{ color: themeContext.color.themes.info.color }}>
        <InfoCircleOutlined />
      </Icon>
    ),
    confirmText: localeContext.locale.MethodDialog.infoText,
    prompt: true,
    localeContext,
    themeContext,
    defaultVisible: true,
    onClosed: onClosedWrapper,
    ...others,
  });

  return {
    destroy,
    update(_props) {
      update((prev) => {
        const ret = typeof _props === 'function' ? _props(prev) : _props;
        return {
          confirmText: ret.localeContext?.locale.MethodDialog.infoText,
          onClosed() {
            ret.onClosed?.();
            destroy();
          },
          ...ret,
        };
      });
    },
  };
};

export const success = (props: MethodDialogFunctionProps): DialogMethodReturnType => {
  const {
    themeContext = defaultThemeContext,
    localeContext = defaultLocaleContext,
    onClosed,
    ...others
  } = props;

  const onClosedWrapper = () => {
    onClosed?.();
    destroy();
  };

  const { destroy, update } = method({
    icon: (
      <Icon style={{ color: themeContext.color.themes.primary.color }}>
        <CheckCircleOutlined />
      </Icon>
    ),
    confirmText: localeContext.locale.MethodDialog.successText,
    prompt: true,
    localeContext,
    themeContext,
    defaultVisible: true,
    onClosed: onClosedWrapper,
    ...others,
  });

  return {
    destroy,
    update(_props) {
      update((prev) => {
        const ret = typeof _props === 'function' ? _props(prev) : _props;
        return {
          confirmText: ret.localeContext?.locale.MethodDialog.successText,
          onClosed() {
            ret.onClosed?.();
            destroy();
          },
          ...ret,
        };
      });
    },
  };
};

export const error = (props: MethodDialogFunctionProps): DialogMethodReturnType => {
  const {
    themeContext = defaultThemeContext,
    localeContext = defaultLocaleContext,
    onClosed,
    ...others
  } = props;

  const onClosedWrapper = () => {
    onClosed?.();
    destroy();
  };

  const { destroy, update } = method({
    icon: (
      <Icon style={{ color: themeContext.color.themes.error.color }}>
        <CloseCircleOutlined />
      </Icon>
    ),
    confirmText: localeContext.locale.MethodDialog.errorText,
    prompt: true,
    localeContext,
    themeContext,
    defaultVisible: true,
    onClosed: onClosedWrapper,
    ...others,
  });

  return {
    destroy,
    update(_props) {
      update((prev) => {
        const ret = typeof _props === 'function' ? _props(prev) : _props;
        return {
          confirmText: ret.localeContext?.locale.MethodDialog.errorText,
          onClosed() {
            ret.onClosed?.();
            destroy();
          },
          ...ret,
        };
      });
    },
  };
};

export const warning = (props: MethodDialogFunctionProps): DialogMethodReturnType => {
  const {
    themeContext = defaultThemeContext,
    localeContext = defaultLocaleContext,
    onClosed,
    ...others
  } = props;

  const onClosedWrapper = () => {
    onClosed?.();
    destroy();
  };

  const { destroy, update } = method({
    icon: (
      <Icon style={{ color: themeContext.color.themes.warning.color }}>
        <ExclamationCircleOutlined />
      </Icon>
    ),
    confirmText: localeContext.locale.MethodDialog.warningText,
    prompt: true,
    localeContext,
    themeContext,
    defaultVisible: true,
    onClosed: onClosedWrapper,
    ...others,
  });

  return {
    destroy,
    update(_props) {
      update((prev) => {
        const ret = typeof _props === 'function' ? _props(prev) : _props;
        return {
          confirmText: ret.localeContext?.locale.MethodDialog.warningText,
          onClosed() {
            ret.onClosed?.();
            destroy();
          },
          ...ret,
        };
      });
    },
  };
};

export const confirm = (props: MethodDialogFunctionProps): DialogMethodReturnType => {
  const {
    themeContext = defaultThemeContext,
    localeContext = defaultLocaleContext,
    onClosed,
    ...others
  } = props;

  const onClosedWrapper = () => {
    onClosed?.();
    destroy();
  };

  const { destroy, update } = method({
    icon: (
      <Icon style={{ color: themeContext.color.themes.primary.color }}>
        <ExclamationCircleOutlined />
      </Icon>
    ),
    confirmText: localeContext.locale.MethodDialog.confirm.confirmText,
    cancelText: localeContext.locale.MethodDialog.confirm.cancelText,
    localeContext,
    themeContext,
    defaultVisible: true,
    onClosed: onClosedWrapper,
    ...others,
  });

  return {
    destroy,
    update(_props) {
      update((prev) => {
        const ret = typeof _props === 'function' ? _props(prev) : _props;
        return {
          confirmText: localeContext.locale.MethodDialog.confirm.confirmText,
          cancelText: localeContext.locale.MethodDialog.confirm.cancelText,
          onClosed() {
            ret.onClosed?.();
            destroy();
          },
          ...ret,
        };
      });
    },
  };
};
