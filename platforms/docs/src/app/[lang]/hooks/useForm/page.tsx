import Docs from '@xl-vision/useForm/__doc__/index.en-US.mdx?locale';
import { hookRoutes } from '@docs/routes';
import createGenerateMetadata from '@docs/utils/createGenerateMetadata';

export const generateMetadata = createGenerateMetadata(hookRoutes, 'useForm');

export default Docs;
