import BaseLayout from '../components/BaseLayout';
import { Layout } from './Layout';

const ComponentLayout: Layout = ({ children }) => {
  return (
    <BaseLayout routeName='hooks' appendEn={false}>
      {children}
    </BaseLayout>
  );
};

export default ComponentLayout;
