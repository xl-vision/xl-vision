import {
  styled as innerStyled,
  CSSObject,
  ExtractProps,
  FunctionInterpolation,
  Interpolation,
  ShouldForwardProp,
} from '@xl-vision/styled-engine';
import { isProduction } from '@xl-vision/utils';
import clsx from 'clsx';
import { ComponentProps, ComponentType, forwardRef } from 'react';
import applyTheme from './applyTheme';
import { StyledComponentKey } from './constants';
import { useConfig } from '../ConfigProvider';
import { Theme } from '../ThemeProvider/createTheme';
import { Style } from '../ThemeProvider/overrideStyles';

export type XlOptions = {
  name?: string;
  slot?: string;
};

const shouldForwardProp = (prop: PropertyKey) => prop !== 'theme' && prop !== 'styleProps';

const middleline = (str: string) => {
  const separator = '-';
  const split = /(?=[A-Z])/;

  return str.split(split).join(separator).toLowerCase();
};

type StyledComponent = { [StyledComponentKey]?: boolean };

const styled = <
  Tag extends keyof JSX.IntrinsicElements | ComponentType<ComponentProps<Tag>>,
  ForwardedProps extends keyof ExtractProps<Tag> = keyof ExtractProps<Tag>,
>(
  tag: Tag & StyledComponent,
  options?: XlOptions,
) => {
  const { name, slot = 'Root' } = options || {};

  let displayName = '';
  let className = '';

  if (name) {
    displayName = name + slot;
    className = middleline(name);
    if (slot !== 'Root') {
      className += `__${middleline(slot)}`;
    }
  }

  const isStyledComponent = tag[StyledComponentKey] as boolean;

  const defaultCreateStyledComponent = innerStyled<Tag, ForwardedProps>(tag, {
    shouldForwardProp: isStyledComponent
      ? undefined
      : (shouldForwardProp as ShouldForwardProp<ForwardedProps>),
    ...(!isProduction && { prefix: displayName || undefined }),
  });

  const overrideCreateStyledComponent = <
    StyleProps extends object | undefined = undefined,
    Props extends Pick<ExtractProps<Tag>, ForwardedProps> = Pick<ExtractProps<Tag>, ForwardedProps>,
    ActualStyleProps = StyleProps extends undefined ? {} : { styleProps: StyleProps },
    ReceivedThemeProps = { theme: Theme } & ActualStyleProps,
    PassedThemeProps = { theme?: Theme } & ActualStyleProps,
  >(
    first: TemplateStringsArray | CSSObject | FunctionInterpolation<Props & ReceivedThemeProps>,
    ...styles: Array<Interpolation<Props & ReceivedThemeProps>>
  ) => {
    const applyOverrideStyle = (props: Props & ReceivedThemeProps & { theme: Theme }) => {
      const { theme } = props;
      if (!name || !slot) {
        return;
      }
      const overrideStyles = theme.overrideStyles as Record<
        string,
        Record<string, Style<StyleProps, Props>>
      >;

      const overrideStyle = overrideStyles[name];

      if (!overrideStyle) {
        return;
      }
      const overrideSlotStyle = overrideStyle[slot];

      if (!overrideSlotStyle) {
        return;
      }
      if (typeof overrideSlotStyle === 'function') {
        return (overrideSlotStyle as FunctionInterpolation<Props & ReceivedThemeProps>)(props);
      }
      return overrideSlotStyle;
    };

    const newStyles = [...styles, applyOverrideStyle].map(applyTheme);

    let newFirst: any = first;

    const numOfCustomFnsApplied = newStyles.length - styles.length;

    if (Array.isArray(newFirst) && numOfCustomFnsApplied > 0) {
      const newFirstArray = newFirst as unknown as TemplateStringsArray;
      const placeholders = new Array<string>(numOfCustomFnsApplied).fill('');
      const raw = [...newFirstArray.raw, ...placeholders];
      newFirst = [...newFirstArray, ...placeholders];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      newFirst.raw = raw;
    } else if (typeof newFirst === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      newFirst = applyTheme(newFirst);
    }

    const InnerDefaultComponent = defaultCreateStyledComponent<Props & PassedThemeProps>(
      newFirst as
        | TemplateStringsArray
        | CSSObject
        | FunctionInterpolation<Props & PassedThemeProps>,
      ...newStyles,
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore

    const DefaultComponent: typeof InnerDefaultComponent = forwardRef((props, ref) => {
      const { clsPrefix } = useConfig();

      return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <InnerDefaultComponent
          {...props}
          className={clsx(
            className && `${clsPrefix}-${className}`,
            // eslint-disable-next-line react/prop-types
            (props as { className?: string }).className,
          )}
          ref={ref}
        />
      );
    });

    (DefaultComponent as StyledComponent)[StyledComponentKey] = true;

    if (!isProduction) {
      InnerDefaultComponent.displayName = `Inner${displayName}`;
      DefaultComponent.displayName = displayName;
    }

    return DefaultComponent;
  };

  return overrideCreateStyledComponent;
};

export default styled;
