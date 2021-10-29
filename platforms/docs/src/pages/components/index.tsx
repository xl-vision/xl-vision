import { useLayoutEffect } from '@xl-vision/hooks';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

const Components: NextPage = () => {
  const router = useRouter();

  useLayoutEffect(() => {
    router.push('/components/quickstart').catch(() => {});
  }, [router]);

  return null;
};

export default Components;
