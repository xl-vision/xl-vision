import { Layout } from './Layout';
import BaseLayout from '../components/BaseLayout';

const ComponentLayout: Layout = ({ children }) => {
  return <BaseLayout routeName='components'>{children}</BaseLayout>;
};

export default ComponentLayout;
