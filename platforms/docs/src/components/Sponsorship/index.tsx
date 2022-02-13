import React from 'react';
import { styled } from '@xl-vision/react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from '../LocalizationProvider';

const Root = styled('div')(({ theme }) => {
  return {
    backgroundColor: theme.color.background.default,
    color: theme.color.text.secondary,
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

const Sponsorship: React.FunctionComponent = () => {
  const { locale } = useLocale();

  return (
    <Root>
      <Title>{locale.sponsorship.title}</Title>
      <div className='list'>
        <Link href='https://vercel.com?utm_source=xl-vision&utm_campaign=oss'>
          <a target='_black' rel='noopener'>
            <Image src='/sponsorship/vercel.svg' alt='vercel' width={160} height={44} />
          </a>
        </Link>
      </div>
    </Root>
  );
};

export default Sponsorship;
