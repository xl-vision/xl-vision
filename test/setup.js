/* eslint-disable import/no-extraneous-dependencies */
if (typeof window !== 'undefined') {
  window.resizeTo = (width, height) => {
    window.innerWidth = width || window.innerWidth;
    window.innerHeight = height || window.innerHeight;
    window.dispatchEvent(new Event('resize'));
  };
}

window.requestAnimationFrame = (cb) => setTimeout(cb, 0);
global.requestAnimationFrame = window.requestAnimationFrame;
window.cancelAnimationFrame = (cb) => clearTimeout(cb);
global.cancelAnimationFrame = window.cancelAnimationFrame;

const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

Enzyme.configure({
  adapter: new Adapter(),
});
