import { useForm } from '@xl-vision/hooks';

const Demo = () => {
  const { register } = useForm();
  return (
    <form>
      <input placeholder='please input firstname' {...register('firstName')} />
      <input placeholder='please input lastname' {...register('lastName')} />
      <button>submit</button>
    </form>
  );
};

export default Demo;
