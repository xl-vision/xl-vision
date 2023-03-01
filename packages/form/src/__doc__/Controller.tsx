import { Input } from '@xl-vision/react';
import { useForm } from '@xl-vision/form';

const Demo = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const {} = useForm({
    defaultValues: {
      firstName: 'Rhys',
      lastName: 'Xia',
    },
  });

  return (
    <div>
      <Input placeholder='please input firstname' />
      <Input placeholder='please input lastname' />
    </div>
  );
};

export default Demo;
