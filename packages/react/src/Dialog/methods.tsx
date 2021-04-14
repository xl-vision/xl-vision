import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from '@xl-vision/icons';
import React from 'react';
import message, { MessageDialogFunctionReturnType } from './message';
import Icon from '../Icon';
import { defaultLanguage, locales } from '../locale';
import { LocalizationContextProps } from '../LocalizationProvider';
import defaultTheme from '../ThemeProvider/defaultTheme';
import { MessageDialogProps } from './message/MessageDialog';

let destoryFunctions: Array<() => void> = [];

const defaultLocaleContext: LocalizationContextProps = {
  locale: locales[defaultLanguage],
  language: defaultLanguage,
};
const defaultThemeContext = defaultTheme;

export const method = (props: MessageDialogProps): MessageDialogFunctionReturnType => {
  const { update, destroy } = message(props);

  const destroyWrapper = () => {
    destoryFunctions = destoryFunctions.filter((it) => it !== destroyWrapper);
    destroy();
  };

  destoryFunctions.push(destroyWrapper);

  return {
    destroy: destroyWrapper,
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

export const info = (props: MessageDialogProps): MessageDialogFunctionReturnType => {
  const {
    themeContext = defaultThemeContext,
    localeContext = defaultLocaleContext,
    ...others
  } = props;

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
    ...others,
  });

  return {
    destroy,
    update(_props) {
      update((prev) => {
        const ret = typeof _props === 'function' ? _props(prev) : _props;
        return {
          confirmText: ret.localeContext?.locale.MethodDialog.infoText,
          ...ret,
        };
      });
    },
  };
};

export const success = (props: MessageDialogProps): MessageDialogFunctionReturnType => {
  const {
    themeContext = defaultThemeContext,
    localeContext = defaultLocaleContext,
    ...others
  } = props;

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
    ...others,
  });

  return {
    destroy,
    update(_props) {
      update((prev) => {
        const ret = typeof _props === 'function' ? _props(prev) : _props;
        return {
          confirmText: ret.localeContext?.locale.MethodDialog.successText,
          ...ret,
        };
      });
    },
  };
};

export const error = (props: MessageDialogProps): MessageDialogFunctionReturnType => {
  const {
    themeContext = defaultThemeContext,
    localeContext = defaultLocaleContext,
    ...others
  } = props;

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

export const warning = (props: MessageDialogProps): MessageDialogFunctionReturnType => {
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

export const confirm = (props: MessageDialogProps): MessageDialogFunctionReturnType => {
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
