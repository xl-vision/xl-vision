import React from 'react';
import { styled } from '@xl-vision/react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from '../LocalizationProvider';

const Root = styled('div')(({ theme }) => {
  return {
    margin: '100px 0 0 0',
    padding: '20px 20px',
    backgroundColor: theme.color.themes.primary.color,
    color: theme.color.themes.primary.text.primary,

    '.list': {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },

    '.card': {
      width: 250,
      height: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  };
});

const Title = styled('h1')(() => {
  return {};
});

const Sponsorship: React.FunctionComponent = () => {
  const { locale } = useLocale();

  return (
    <Root>
      <Title>{locale.sponsorship.title}</Title>
      <div className='list'>
        <div className='card'>
          <Link href='https://vercel.com?utm_source=xl-vision&utm_campaign=oss'>
            <a target='_black' rel='noopener'>
              <Image src='/sponsorship/vercel.svg' alt='vercel' width={212} height={44} />
            </a>
          </Link>
        </div>
      </div>
    </Root>
  );
};

export default Sponsorship;
