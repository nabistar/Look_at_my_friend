import breakpoints from 'styled-components-breakpoints';

// 반응형 웹 사이즈 정의
const sizes = {
  ph: 400,
  sm: 600,
  md: 768,
  lg: 992,
  xl: 1200
};

// media query 생성
export default breakpoints(sizes);