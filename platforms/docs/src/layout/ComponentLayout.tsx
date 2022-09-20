import BaseLayout from '../components/BaseLayout';
import { Layout } from './Layout';

const ComponentLayout: Layout = ({ children }) => {
  return <BaseLayout routeName='components'>{children}</BaseLayout>;
};

export default ComponentLayout;
