import React from 'react'
import ReactDOM from 'react-dom'
// @ts-ignore
import { MDXProvider } from '@mdx-js/react'
import Demo from './aa/demo.md'
import DemoBox from './components/DemoBox'

import 'prismjs/themes/prism.css'

const components = {
  DemoBox
}

const C = (
  <MDXProvider components={components}>
    <Demo />
  </MDXProvider>
)

ReactDOM.render(C, document.querySelector('#app'))
