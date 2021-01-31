import CSS from 'csstype'
import React from 'react'

export type CSSProperties = CSS.Properties<string | number>

export type CSSPseudos = { [K in CSS.Pseudos]?: CSSObject }

export interface CSSObject extends CSSProperties, CSSPseudos {
  [key: string]: CSSObject | string | number | undefined
}

export type CSSKeyframes = object & { [key: string]: CSSObject }

export type InterpolationPrimitive =
  | null
  | undefined
  | boolean
  | number
  | string
  | CSSKeyframes
  | CSSObject

export type CSSInterpolation = InterpolationPrimitive | Array<CSSInterpolation>

export interface FunctionInterpolation<P> {
  (props: P): Interpolation<P>
}

export type Interpolation<P> =
  | InterpolationPrimitive
  | Array<Interpolation<P>>
  | FunctionInterpolation<P>

export interface CreateGlobalStyle {}

export interface FilteringStyledOptions<Props, ForwardedProps extends keyof Props = keyof Props> {
  displayName?: string
  shouldForwardProp?(propName: PropertyKey): propName is ForwardedProps
}

export interface Styled {
  <
    C extends React.ComponentClass<React.ComponentProps<C>>,
    ForwardedProps extends keyof React.ComponentProps<C> = keyof React.ComponentProps<C>
  >(
    component: C,
    options: FilteringStyledOptions<React.ComponentProps<C>, ForwardedProps>
  ): CreateStyledComponent<
    Pick<PropsOf<C>, ForwardedProps> & {
      theme?: Theme
      as?: React.ElementType
    },
    {},
    {
      ref?: React.Ref<InstanceType<C>>
    }
  >

  <C extends React.ComponentClass<React.ComponentProps<C>>>(
    component: C,
    options?: StyledOptions<React.ComponentProps<C>>
  ): CreateStyledComponent<
    PropsOf<C> & {
      theme?: Theme
      as?: React.ElementType
    },
    {},
    {
      ref?: React.Ref<InstanceType<C>>
    }
  >

  <
    C extends React.ComponentType<React.ComponentProps<C>>,
    ForwardedProps extends keyof React.ComponentProps<C> = keyof React.ComponentProps<C>
  >(
    component: C,
    options: FilteringStyledOptions<React.ComponentProps<C>, ForwardedProps>
  ): CreateStyledComponent<
    Pick<PropsOf<C>, ForwardedProps> & {
      theme?: Theme
      as?: React.ElementType
    }
  >

  <C extends React.ComponentType<React.ComponentProps<C>>>(
    component: C,
    options?: StyledOptions<React.ComponentProps<C>>
  ): CreateStyledComponent<
    PropsOf<C> & {
      theme?: Theme
      as?: React.ElementType
    }
  >

  <
    Tag extends keyof JSX.IntrinsicElements,
    ForwardedProps extends keyof JSX.IntrinsicElements[Tag] = keyof JSX.IntrinsicElements[Tag]
  >(
    tag: Tag,
    options: FilteringStyledOptions<JSX.IntrinsicElements[Tag], ForwardedProps>
  ): CreateStyledComponent<
    { theme?: Theme; as?: React.ElementType },
    Pick<JSX.IntrinsicElements[Tag], ForwardedProps>
  >

  <Tag extends keyof JSX.IntrinsicElements>(
    tag: Tag,
    options?: StyledOptions<JSX.IntrinsicElements[Tag]>
  ): CreateStyledComponent<{ theme?: Theme; as?: React.ElementType }, JSX.IntrinsicElements[Tag]>
}
