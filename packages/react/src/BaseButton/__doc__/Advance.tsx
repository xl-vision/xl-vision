import React from 'react';
import { BaseButton, styled } from '@xl-vision/react';
import Breakfast from './breakfast.jpg';
import Burgers from './burgers.jpg';
import Camera from './camera.jpg';

const images = [
  {
    image: Breakfast,
    title: 'Breakfast',
    width: '40%',
  },
  {
    image: Burgers,
    title: 'Burgers',
    width: '30%',
  },
  {
    image: Camera,
    title: 'Camera',
    width: '30%',
  },
];

console.log(images)

const CustomButton = styled(BaseButton)(() => {
  return {
    height: 200,
    color: '#000',
    '&:focus': {
      opacity: 0.85,
    },
    '.img': {
      display: 'block',
      position: 'absolute',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      backgroundSize: 'cover',
    },
    '.title': {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      color: '#fff',
      fontSize: 20,
      fontWeight: 'bold',
    },
  };
});

export default () => {
  return (
    <div className='container'>
      {images.map((it) => (
        <CustomButton
          key={it.title}
          style={{
            width: it.width,
          }}
        >
          <span
            className='img'
            style={{
              backgroundImage: `url(${it.image.src})`,
            }}
          />
          <span className='title'>{it.title}</span>
        </CustomButton>
      ))}
    </div>
  );
};
