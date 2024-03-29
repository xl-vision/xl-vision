'use client';

import { BaseButton, styled } from '@xl-vision/react';

const CustomButton = styled(BaseButton)(() => {
  return {
    padding: '6px 16px',
    borderRadius: '3px',
    backgroundColor: '#9c27b0',
    color: '#fff',
    '&:focus': {
      opacity: 0.85,
    },
  };
});

const Basic = () => {
  return (
    <div className='container'>
      <CustomButton>custom css</CustomButton>
    </div>
  );
};

export default Basic;
