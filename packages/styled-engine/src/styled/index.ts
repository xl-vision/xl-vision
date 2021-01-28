import scStyled from 'styled-components'

export type StyledOptions = {
  displayName?: string
  shouldForwardProp?: <O extends {}>(
    prop: keyof O,
    // eslint-disable-next-line no-shadow
    defaultValidatorFn: (prop: keyof O) => boolean
  ) => boolean
}

export default function styled<C extends keyof JSX.IntrinsicElements | React.ComponentType<any>>(
  tag: C,
  options?: StyledOptions
) {
  if (options) {
    return scStyled(tag).withConfig({
      // @ts-ignore
      displayName: options.displayName,
      shouldForwardProp: options.shouldForwardProp
    })
  }

  return scStyled(tag)
}