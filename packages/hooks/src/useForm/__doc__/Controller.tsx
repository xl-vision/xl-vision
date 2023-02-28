import { Input } from '@xl-vision/react';
import { useForm } from '@xl-vision/hooks';

const Demo = () => {
  const { control, values } = useForm({
    defaultValues: {
      firstName: 'Rhys',
      lastName: 'Xia',
    },
  });

  return (
    <div>
      <Input placeholder='please input firstname' {...control('firstName')} />
      <Input placeholder='please input lastname' {...control('lastName')} />
      <div>{JSON.stringify(values)}</div>
    </div>
  );
};

export default Demo;
