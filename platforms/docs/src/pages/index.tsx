import Head from 'next/head';
import React from 'react';
import { NextPage, GetStaticProps } from 'next';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>首页｜Explore</title>
      </Head>
      <div>abc</div>
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};
