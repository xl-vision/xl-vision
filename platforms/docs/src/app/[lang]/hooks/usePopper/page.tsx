import Docs from '@xl-vision/usePopper/__doc__/index.en-US.mdx?locale';
import { hookRoutes } from '@docs/routes';
import createGenerateMetadata from '@docs/utils/createGenerateMetadata';

export const generateMetadata = createGenerateMetadata(hookRoutes, 'usePopper');

export default Docs;
