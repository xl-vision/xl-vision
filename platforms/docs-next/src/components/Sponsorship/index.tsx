import { styled } from '@xl-vision/react';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';
import useLocale from '../../hooks/useLocale';
import VercelIcon from './VercelIcon';

const Root = styled('div')(({ theme }) => {
  return {
    backgroundColor: theme.colors.background.default,
    color: theme.colors.text.secondary,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',

    '.list': {
      alignItems: 'center',
      maxWidth: 520,
    },

    a: {
      display: 'inline-block',
      margin: '20px 15px 0',
    },
  };
});

const Title = styled('h5')(({ theme }) => {
  return {
    ...theme.typography.h5.style,
    margin: '10px 0',
  };
});

const Sponsorship: FC = () => {
  const { locale } = useLocale();

  return (
    <Root>
      <Title>{locale.sponsorship.title}</Title>
      <div className='list'>
        <Link
          href='https://vercel.com?utm_source=xl-vision&utm_campaign=oss'
          rel='noopener'
          target='_black'
        >
          <VercelIcon />
        </Link>
      </div>
    </Root>
  );
};

export default Sponsorship;
