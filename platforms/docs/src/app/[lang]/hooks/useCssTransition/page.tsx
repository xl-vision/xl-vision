import { hookRoutes } from '@docs/routes';
import createGenerateMetadata from '@docs/utils/createGenerateMetadata';
import Docs from './_docs';

export const generateMetadata = createGenerateMetadata(hookRoutes, 'useCssTransition');

export default Docs;
