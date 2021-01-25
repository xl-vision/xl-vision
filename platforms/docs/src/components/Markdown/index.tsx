import React from 'react'
// @ts-ignore
import { MDXProvider } from '@mdx-js/react'
import 'prismjs/themes/prism.css'
import DemoBox from '../DemoBox'

export type MarkdownProps = {
  children: React.ReactNode
}

const components = {
  DemoBox
}

const Markdown: React.FunctionComponent<MarkdownProps> = (props) => (
    <MDXProvider components={components}>
      <div {...props} />
    </MDXProvider>
  )

export default Markdown
