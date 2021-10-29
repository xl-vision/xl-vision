import { NextPage } from 'next';
import { useRouter } from 'next/router';

const Demo: NextPage = () => {
  const router = useRouter();

  return <h1>{router.asPath}</h1>;
};

export default Demo;
