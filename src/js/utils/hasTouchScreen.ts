export const hasTouchScreen = () => {
  if (navigator.maxTouchPoints > 0) {
    return true;
  }
  if ((navigator as any).msMaxTouchPoints > 0) {
    return true;
  }
  if (!window.matchMedia('(hover: hover)').matches) {
    return true;
  }
  return false;
};
