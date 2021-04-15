import ReactDOM from 'react-dom';
import React from 'react';
import { ThemeContext as StyledThemeContext } from '@xl-vision/styled-engine';
import { isServer } from '../../utils/env';
import { MessageDialogProps, MessageDialogRef } from './MessageDialog';
import { voidFn } from '../../utils/function';
import warning from '../../utils/warning';
import createMessageDialog, { MessageDialogType } from './createMessageDialog';
import { Theme, ThemeContext } from '../../ThemeProvider';
import { LocalizationContext, LocalizationContextProps } from '../../LocalizationProvider';
import defaultTheme from '../../ThemeProvider/defaultTheme';
import { locales, defaultLanguage } from '../../locale';

export * from './MessageDialog';
export * from './createMessageDialog';

export interface MessageDialogFunctionProps extends MessageDialogProps {
  onClosed?: (isDestroy?: true) => void;
  themeContext?: Theme;
  localizationContext?: LocalizationContextProps;
}

export type MessageDialogFunctionUpdate = (
  props:
    | Partial<MessageDialogFunctionProps>
    | ((prev: MessageDialogFunctionProps) => Partial<MessageDialogFunctionProps>),
) => void;

export type MessageDialogFunctionReturnType = {
  destroy: () => void;
  update: MessageDialogFunctionUpdate;
};

const defaultThemeContext: Theme = defaultTheme;

const defaultLocalizationContext: LocalizationContextProps = {
  locale: locales[defaultLanguage],
  language: defaultLanguage,
};

export default (
  props: MessageDialogFunctionProps,
  type?: MessageDialogType,
): MessageDialogFunctionReturnType => {
  if (isServer) {
    return {
      destroy: voidFn,
      update: voidFn,
    };
  }

  const Dialog = createMessageDialog(type);

  const div = document.createElement('div');
  document.body.appendChild(div);

  let currentProps: MessageDialogFunctionProps = {
    ...props,
  };

  let destroyState = false;

  const messgaeDialogRef: {
    current: MessageDialogRef | null;
  } = { current: null };

  const render = (renderProps: MessageDialogFunctionProps) => {
    if (destroyState) {
      return warning(
        true,
        `The dialog instance was destroyed, please do not update or destroy it again.`,
      );
    }

    const { localizationContext, themeContext, ...others } = renderProps;

    setTimeout(() => {
      ReactDOM.render(
        <LocalizationContext.Provider value={localizationContext || defaultLocalizationContext}>
          <ThemeContext.Provider value={themeContext || defaultThemeContext}>
            <StyledThemeContext.Provider value={themeContext || defaultThemeContext}>
              <Dialog getContainer={null} {...others} ref={messgaeDialogRef} />
            </StyledThemeContext.Provider>
          </ThemeContext.Provider>
        </LocalizationContext.Provider>,
        div,
      );
    });
  };

  const update: MessageDialogFunctionUpdate = (updateProps) => {
    const newProps = typeof updateProps === 'function' ? updateProps(currentProps) : updateProps;
    currentProps = { ...currentProps, ...newProps };

    render(currentProps);
  };

  const destroyDOM = () => {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }
  };

  const destroy = () => {
    if (!messgaeDialogRef.current?.visible) {
      destroyState = true;
      destroyDOM();
      return;
    }
    const { onClosed } = currentProps;
    render({
      ...currentProps,
      visible: false,
      onClosed: () => {
        destroyState = true;
        onClosed?.(true);
        destroyDOM();
      },
    });
  };

  render(currentProps);

  return {
    destroy,
    update,
  };
};
