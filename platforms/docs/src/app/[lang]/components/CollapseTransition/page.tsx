import { componentRoutes } from '@docs/routes';
import createGenerateMetadata from '@docs/utils/createGenerateMetadata';
import Docs from './_docs';

export const generateMetadata = createGenerateMetadata(componentRoutes, 'CollapseTransition');

export default Docs;
