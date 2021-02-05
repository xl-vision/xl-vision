import CSS from 'csstype';
// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react';

export type CSSProperties = CSS.Properties<string | number>;

export type CSSPseudos = { [K in CSS.Pseudos]?: CSSObject };

export type CSSObject = CSSProperties &
  CSSPseudos & {
    [key: string]: CSSObject | string | number | undefined;
  };

export type CSSKeyframes = object & { [key: string]: CSSObject };

export type InterpolationPrimitive =
  | null
  | undefined
  | boolean
  | number
  | string
  | Keyframes
  | CSSObject;

export type Keyframes = {};

export type FunctionInterpolation<P> = (props: P) => Interpolation<P>;

export type SimpleInterpolation =
  | InterpolationPrimitive
  | StyledComponentInterpolation
  | Array<SimpleInterpolation>;

export type Interpolation<P> =
  | InterpolationPrimitive
  | Array<Interpolation<P>>
  | FunctionInterpolation<P>
  | StyledComponentInterpolation;

type StyledComponentInterpolation = Pick<
  StyledComponent<any, any, any>,
  keyof StyledComponent<any, any>
>;

export type PropsOf<
  C extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>
> = JSX.LibraryManagedAttributes<C, React.ComponentProps<C>>;

export type ExtractProps<
  Tag extends keyof JSX.IntrinsicElements | React.ComponentType<any>
> = Tag extends keyof JSX.IntrinsicElements ? JSX.IntrinsicElements[Tag] : PropsOf<Tag>;

export type StyledComponent<
  InnerProps,
  StyleProps,
  Theme extends object = {}
> = React.FunctionComponent<InnerProps & StyleProps & { theme?: Theme }> & {
  withComponent<Tag extends keyof JSX.IntrinsicElements | React.ComponentType<any>>(
    tag: Tag,
  ): StyledComponent<ExtractProps<Tag>, StyleProps, Theme>;
};

export interface CreateStyledComponent<
  ComponentProps extends {},
  StyleProps extends {} = {},
  Theme extends {} = {}
> {
  <AdditionalProps extends {} = {}>(
    first:
      | TemplateStringsArray
      | CSSObject
      | FunctionInterpolation<ComponentProps & StyleProps & AdditionalProps & { theme: Theme }>,
    ...styles: Array<
      Interpolation<ComponentProps & StyleProps & AdditionalProps & { theme: Theme }>
    >
  ): StyledComponent<ComponentProps & AdditionalProps, StyleProps, Theme>;
}

/** Same as StyledOptions but shouldForwardProp must be a type guard */
export type FilteringStyledOptions<Props, ForwardedProps extends keyof Props = keyof Props> = {
  display?: string;
  shouldForwardProp?(propName: PropertyKey): propName is ForwardedProps;
  target?: string;
};

export type Styled = <
  Tag extends keyof JSX.IntrinsicElements | React.ComponentClass<React.ComponentProps<Tag>>,
  ForwardedProps extends keyof ExtractProps<Tag> = keyof ExtractProps<Tag>,
  Theme extends {} = {}
>(
  tag: Tag,
  options?: FilteringStyledOptions<ExtractProps<Tag>, ForwardedProps>,
) => CreateStyledComponent<Pick<ExtractProps<Tag>, ForwardedProps>, {}, Theme>;

export type GlobalStyleComponent<P, T extends {}> = React.ComponentClass<P & { theme: T }>;

export type CreateGlobalStyle<P extends object = {}, T extends object = {}> = (
  first: TemplateStringsArray | CSSObject | FunctionInterpolation<P & { theme: T }>,
  ...styles: Array<Interpolation<P & { theme: T }>>
) => GlobalStyleComponent<P, T>;

export type CreateKeyframes = (
  strings: TemplateStringsArray | CSSKeyframes,
  ...interpolations: Array<SimpleInterpolation>
) => Keyframes;

export type ThemeContext = React.Context<object>;
