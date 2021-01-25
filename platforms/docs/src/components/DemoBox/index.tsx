import React from 'react'
import PropTypes from 'prop-types'

export type DemoBoxProps = {
  children: [React.ReactNode, React.ReactNode, React.ReactNode, React.ReactNode, React.ReactNode]
}

const DemoBox: React.FunctionComponent<DemoBoxProps> = ({ children }) => {
  const [title, desc, tsxCode, jsxCode, preview] = children

  return (
    <div>
      标题: {title}
      <hr/> 
      描述: {desc}
      <hr/>
      tsx: {tsxCode}
      <hr/>
      jsx: {jsxCode}
      <hr/>
      预览: {preview}
    </div>
  )
}

DemoBox.propTypes = {
  children: PropTypes.any
}

export default DemoBox