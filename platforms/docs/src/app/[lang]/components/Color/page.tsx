import { componentRoutes } from '@docs/routes';
import createGenerateMetadata from '@docs/utils/createGenerateMetadata';
import Docs from './_docs/index.en-US.mdx?locale';

export const generateMetadata = createGenerateMetadata(componentRoutes, 'Color');

export default Docs;
