import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

// eslint-disable-next-line no-shadow
enum CodeType {
  TYPESCRIPT,
  JAVASCRIPT
}

export type CodeProps = {
  children: [React.ReactNode, React.ReactNode]
}

const Wrapper = styled.div``

const Bar = styled.div`
  border-bottom: 1px solid #f0f0f0;
  text-align: center;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  padding: 10px 0;
`

const Button = styled.button<{ isActive: boolean }>`
  color: ${(props) => (props.isActive ? '#1890ff' : 'rgba(0,0,0,0.85)')};
`

const Content = styled.div``

const Code: React.FunctionComponent<CodeProps> = (props) => {
  const { children } = props

  const [tsx, jsx] = children

  const [codeType, setCodeType] = React.useState(CodeType.TYPESCRIPT)

  return (
    <Wrapper>
      <Bar>
        <Button
          isActive={codeType === CodeType.TYPESCRIPT}
          onClick={() => setCodeType(CodeType.TYPESCRIPT)}
        >
          Typescript
        </Button>
        <Button
          isActive={codeType === CodeType.JAVASCRIPT}
          onClick={() => setCodeType(CodeType.JAVASCRIPT)}
        >
          Javascript
        </Button>
      </Bar>
      <Content>{codeType === CodeType.TYPESCRIPT ? tsx : jsx}</Content>
    </Wrapper>
  )
}

Code.propTypes = {
  children: PropTypes.any
}

export default Code
