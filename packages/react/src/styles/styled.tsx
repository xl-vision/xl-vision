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
import { ComponentProps, ComponentType, forwardRef, JSX } from 'react';
import applyTheme from './applyTheme';
import { StyledComponentKey } from './constants';
import { Theme, Style, useTheme } from '../ThemeProvider';

export type XlOptions = {
  name?: string;
  slot?: string;
};

const NOT_FORWARD_PROPS: Set<PropertyKey> = new Set(['theme', 'styleProps', 'as']);

const shouldForwardProp = (prop: PropertyKey) => !NOT_FORWARD_PROPS.has(prop);

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
    ...(!isProduction && { label: displayName || undefined }),
  });

  const overrideCreateStyledComponent = <
    StyleProps extends object | void = void,
    Props extends Pick<ExtractProps<Tag>, ForwardedProps> = Pick<ExtractProps<Tag>, ForwardedProps>,
    ActualStyleProps = StyleProps extends void ? object : { styleProps: StyleProps },
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let newFirst: any = first;

    if (Array.isArray(newFirst) && 'raw' in newFirst) {
      const newFirstArray = newFirst as unknown as TemplateStringsArray;
      newFirst = [...newFirstArray, ''];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      newFirst.raw = [...newFirstArray.raw, ''];
    } else {
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

    // @ts-expect-error fix types error
    const DefaultComponent: typeof InnerDefaultComponent = forwardRef((props, ref) => {
      const { clsPrefix } = useTheme();

      return (
        // @ts-expect-error fix types error
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
