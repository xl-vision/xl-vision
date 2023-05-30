import fs from 'fs/promises';
import path from 'path';
import Demo from './demo';

const Page = async () => {
  const content = await fs.readFile(path.resolve(process.cwd(), 'package.json'), 'utf8');
  return (
    <div>
      test
      <Demo text={content} />
    </div>
  );
};

export default Page;
