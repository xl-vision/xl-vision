'use client';

import { Input, styled } from '@xl-vision/react';
import { Controller, useForm, useWatch } from '@xl-vision/useForm';

const Demo = () => {
  const { form } = useForm({
    defaultValues: {
      firstName: 'Rhys',
      lastName: 'Xia',
    },
  });

  const value = useWatch({ form });

  return (
    <Root>
      <Controller
        field='firstName'
        form={form}
        render={(props) => <Input placeholder='please input firstname' {...props} />}
      />

      <Controller
        field='lastName'
        form={form}
        render={(props) => <Input placeholder='please input lastname' {...props} />}
      />
      <div className='info'>
        <span className='label'>firstName:</span>
        <span className='value'>{value.firstName}</span>
      </div>
      <div className='info'>
        <span className='label'>lastName:</span>
        <span className='value'>{value.lastName}</span>
      </div>
    </Root>
  );
};

export default Demo;

const Root = styled('div')(() => {
  return {
    '> *': {
      margin: '10px 0',
    },
    '.info': {
      display: 'flex',
      alignItems: 'center',
      '.label': {
        paddingRight: 6,
        fontWeight: 'bold',
      },
      '.value': {},
    },
  };
});
