'use client';

import { styled } from '@xl-vision/react';
import { keyframes } from '@xl-vision/styled-engine';
import Head from 'next/head';
import Link from 'next/link';
import useLocale from '@docs/hooks/useLocale';
import useSizeBelow from '@docs/hooks/useSizeBelow';

const bgShadow = keyframes`
    0% {
      box-shadow: inset -160px 160px 0px 5px rgba(0, 0, 0, 0.4);
    }
    45% {
      box-shadow: inset 0px 0px 0px 0px rgba(0, 0, 0, 0.1);
    }
    55% {
      box-shadow: inset 0px 0px 0px 0px rgba(0, 0, 0, 0.1);
    }
    100% {
      box-shadow: inset 160px -160px 0px 5px rgba(0, 0, 0, 0.4);
    }
`;

const Root = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  .error-container {
    text-align: center;
    font-size: 106px;
    font-family: 'Catamaran', sans-serif;
    font-weight: 800;
    margin: 70px 15px;
    white-space: nowrap;

    & > span {
      display: inline-block;
      position: relative;
    }
    & > .four {
      width: 136px;
      height: 43px;
      border-radius: 999px;

      background:
        linear-gradient(
          140deg,
          rgba(0, 0, 0, 0.1) 0%,
          rgba(0, 0, 0, 0.07) 43%,
          transparent 44%,
          transparent 100%
        ),
        linear-gradient(
          105deg,
          transparent 0%,
          transparent 40%,
          rgba(0, 0, 0, 0.06) 41%,
          rgba(0, 0, 0, 0.07) 76%,
          transparent 77%,
          transparent 100%
        ),
        linear-gradient(to right, #d89ca4, #e27b7e);
      &:before,
      &:after {
        content: '';
        display: block;
        position: absolute;
        border-radius: 999px;
      }
      &:before {
        width: 43px;
        height: 156px;
        left: 60px;
        bottom: -43px;
        background:
          linear-gradient(
            128deg,
            rgba(0, 0, 0, 0.1) 0%,
            rgba(0, 0, 0, 0.07) 40%,
            transparent 41%,
            transparent 100%
          ),
          linear-gradient(
            116deg,
            rgba(0, 0, 0, 0.1) 0%,
            rgba(0, 0, 0, 0.07) 50%,
            transparent 51%,
            transparent 100%
          ),
          linear-gradient(to top, #99749d, #b895ab, #cc9aa6, #d7969e, #e0787f);
      }
      &:after {
        width: 137px;
        height: 43px;
        transform: rotate(-49.5deg);
        left: -18px;
        bottom: 36px;
        background: linear-gradient(to right, #99749d, #b895ab, #cc9aa6, #d7969e, #e0787f);
      }
    }
    & > .zero {
      vertical-align: text-top;
      width: 156px;
      height: 156px;
      border-radius: 999px;
      background:
        linear-gradient(
          -45deg,
          transparent 0%,
          rgba(0, 0, 0, 0.06) 50%,
          transparent 51%,
          transparent 100%
        ),
        linear-gradient(to top right, #99749d, #99749d, #b895ab, #cc9aa6, #d7969e, #ed8687, #ed8687);
      overflow: hidden;
      animation: ${bgShadow} 5s infinite;
      &:before {
        content: '';
        display: block;
        position: absolute;
        transform: rotate(45deg);
        width: 90px;
        height: 90px;
        background-color: transparent;
        left: 0px;
        bottom: 0px;
        background:
          linear-gradient(
            95deg,
            transparent 0%,
            transparent 8%,
            rgba(0, 0, 0, 0.07) 9%,
            transparent 50%,
            transparent 100%
          ),
          linear-gradient(
            85deg,
            transparent 0%,
            transparent 19%,
            rgba(0, 0, 0, 0.05) 20%,
            rgba(0, 0, 0, 0.07) 91%,
            transparent 92%,
            transparent 100%
          );
      }
      &:after {
        content: '';
        display: block;
        position: absolute;
        border-radius: 999px;
        width: 70px;
        height: 70px;
        left: 43px;
        bottom: 43px;
        background: #fdfaf5;
        box-shadow: -2px 2px 2px 0px rgba(0, 0, 0, 0.1);
      }
    }
  }
  .screen-reader-text {
    position: absolute;
    top: -9999em;
    left: -9999em;
  }
  .link-container {
    text-align: center;
  }
  .more-link {
    text-transform: uppercase;
    font-size: 13px;
    background-color: #de7e85;
    padding: 10px 15px;
    border-radius: 0;
    color: #fff;
    display: inline-block;
    margin-right: 5px;
    margin-bottom: 5px;
    line-height: 1.5;
    text-decoration: none;
    margin-top: 50px;
    letter-spacing: 1px;

    @media (max-width: 576px) {
      margin-top: 20px;
    }
  }
`;

const NotFound = () => {
  const { locale } = useLocale();

  const isBelowMd = useSizeBelow('md');

  const styles = {
    transform: `scale(${isBelowMd ? 0.7 : 1})`,
  };

  const titleContent = `${locale.pages[404].title} | xl-vision`;

  return (
    <Root>
      <Head>
        <title>{titleContent}</title>
      </Head>
      <section className='error-container' style={styles}>
        <span className='four'>
          <span className='screen-reader-text'>4</span>
        </span>
        <span className='zero'>
          <span className='screen-reader-text'>0</span>
        </span>
        <span className='four'>
          <span className='screen-reader-text'>4</span>
        </span>
      </section>
      <div className='link-container'>
        <Link className='more-link' href='/zh-CN'>
          {locale.pages[404].link}
        </Link>
      </div>
    </Root>
  );
};

export default NotFound;
