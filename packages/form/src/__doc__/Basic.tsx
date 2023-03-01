import { useForm } from '@xl-vision/form';

const Demo = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { register } = useForm({
    defaultValues: {
      firstName: 'Rhys',
      lastName: 'Xia',
    },
  });

  return (
    <div>
      <input placeholder='please input firstname' {...register('firstName')} />
      <input placeholder='please input lastname' {...register('lastName')} />
    </div>
  );
};

export default Demo;
