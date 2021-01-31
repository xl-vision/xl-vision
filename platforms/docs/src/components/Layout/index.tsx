import React from 'react'
import Markdown from '../markdown'
import Demo from '../../views/demo.md'

const Layout: React.FunctionComponent<{}> = () => (
  <Markdown>
    <Demo />
  </Markdown>
)

export default Layout
