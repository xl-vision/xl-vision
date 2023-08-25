import { Layout } from './Layout';
import BaseLayout from '../components/BaseLayout';

const ComponentLayout: Layout = ({ children }) => {
  return (
    <BaseLayout appendEn={false} routeName='hooks'>
      {children}
    </BaseLayout>
  );
};

export default ComponentLayout;
