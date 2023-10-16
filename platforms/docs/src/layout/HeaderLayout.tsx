import { styled } from '@xl-vision/react';
import { Layout } from './Layout';
import Header from '../components/Header';

const Root = styled('div')(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    '.main': {
      flex: 1,
    },
  };
});

const HeaderLayout: Layout = ({ children }) => {
  return (
    <Root>
      <Header />
      <div className='main'>{children}</div>
    </Root>
  );
};

export default HeaderLayout;