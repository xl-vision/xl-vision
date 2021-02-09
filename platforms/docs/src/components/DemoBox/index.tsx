import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Code from './Code';

export type DemoBoxProps = {
  children: [React.ReactNode, React.ReactNode, React.ReactNode, React.ReactNode, React.ReactNode];
};

const Wrapper = styled.div`
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
  margin: 8px 0;
`;

const Preview = styled.div`
  padding: 42px 24px 50px;
  border-top: 1px solid #f0f0f0;
`;

const InfoWrapper = styled.div`
  position: relative;
  font-size: 14px;
  border-top: 1px solid #f0f0f0;
  color: rgba(0, 0, 0, 0.85);
`;

const TitleWrapper = styled.div`
  position: absolute;
  background-color: #fff;
  top: -12px;
  margin-left: 16px;
  padding: 0px 8px;
`;

const DescWrapper = styled.div`
  padding: 18px 24px 12px;
`;

const CodeWrapper = styled.div`
  border-top: 1px solid #f0f0f0;
`;

const Button = styled.button`
  position: absolute;
  right: 10px;
  top: 10px;
`;

const DemoBox: React.FunctionComponent<DemoBoxProps> = ({ children }) => {
  const [title, desc, tsxCode, jsxCode, preview] = children;

  const [isExpand, setExpand] = React.useState(false);

  return (
    <Wrapper>
      <Preview>{preview}</Preview>
      <InfoWrapper>
        <TitleWrapper>{title}</TitleWrapper>
        <DescWrapper>{desc}</DescWrapper>
        <Button onClick={() => setExpand(!isExpand)}>{isExpand ? '隐藏' : '展开'}</Button>
      </InfoWrapper>
      {isExpand && (
        <CodeWrapper>
          <Code>
            {tsxCode}
            {jsxCode}
          </Code>
        </CodeWrapper>
      )}
    </Wrapper>
  );
};

DemoBox.propTypes = {
  children: PropTypes.any,
};

export default DemoBox;
