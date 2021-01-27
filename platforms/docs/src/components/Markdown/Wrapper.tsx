import clsx from 'clsx'
import React from 'react'
import './prism-light.scss'
import './prism-dark.scss'

const Wrapper: React.FunctionComponent<any> = (props) => {
  // eslint-disable-next-line react/prop-types, @typescript-eslint/no-unsafe-assignment
  const { className, ...others } = props

  const [isDark, setDark] = React.useState(false)

  const callback = React.useCallback((e: MediaQueryListEvent) => {
    setDark(e.matches)
  }, [])

  React.useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    setDark(media.matches)

    media.addEventListener('change', callback)

    return () => {
      media.removeEventListener('change', callback)
    }
  }, [callback])

  const classes = clsx(['markdown', `markdown--${isDark ? 'dark' : 'light'}`, className])

  return <div {...others} className={classes} />
}

export default Wrapper
