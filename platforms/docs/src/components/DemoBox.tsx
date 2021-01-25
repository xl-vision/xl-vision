import React from 'react'
import PropTypes from 'prop-types'

export type DemoBoxProps = {
  children: [React.ReactNode, React.ReactNode, React.ReactNode, React.ReactNode]
}

const DemoBox: React.FunctionComponent<DemoBoxProps> = ({ children }) => {
  const [title, desc, code, preview] = children

  return (
    <div>
      标题: {title}
      <hr/> 
      描述: {desc}
      <hr/>
      代码: {code}
      <hr/>
      预览: {preview}
    </div>
  )
}

DemoBox.propTypes = {
  children: PropTypes.any
}

export default DemoBox