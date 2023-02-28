import { useForm } from '@xl-vision/hooks';

const Demo = () => {
  const { register, values } = useForm({
    defaultValues: {
      firstName: 'Rhys',
      lastName: 'Xia',
    },
  });

  return (
    <div>
      <input placeholder='please input firstname' {...register('firstName')} />
      <input placeholder='please input lastname' {...register('lastName')} />
      <div>{JSON.stringify(values)}</div>
    </div>
  );
};

export default Demo;
