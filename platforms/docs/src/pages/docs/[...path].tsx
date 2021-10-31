import { NextPage } from 'next';
import { useRouter } from 'next/router';

const Docs: NextPage = () => {
  const router = useRouter();

  return <div>{router.asPath}</div>;
};

export default Docs;
