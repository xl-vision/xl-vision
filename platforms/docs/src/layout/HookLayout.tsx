import BaseLayout from '../components/BaseLayout';
import { Layout } from './Layout';

const ComponentLayout: Layout = ({ children }) => {
  return (
    <BaseLayout appendEn={false} routeName='hooks'>
      {children}
    </BaseLayout>
  );
};

export default ComponentLayout;
