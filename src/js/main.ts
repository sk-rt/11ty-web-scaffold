'use strict';
// scss
import '@/scss/main.scss';
// svg sprits
import '@/assets/svg-sprites/icon_arrow.svg';
import '@/assets/svg-sprites/icon_external.svg';

// esm
import { header } from './modules/header';
import { smoothScroll } from './modules/smoothScroll';

document.addEventListener(
  'DOMContentLoaded',
  () => {
    main();
  },
  false
);

const main = () => {
  header();
  smoothScroll();
};
