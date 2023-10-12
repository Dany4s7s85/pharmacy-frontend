import styled, { keyframes } from 'styled-components/macro';

const spin = keyframes`
  0%,
  100% {
    box-shadow: .2em 0px 0 0px currentcolor;
  }
  12% {
    box-shadow: .2em .2em 0 0 currentcolor;
  }
  25% {
    box-shadow: 0 .2em 0 0px currentcolor;
  }
  37% {
    box-shadow: -.2em .2em 0 0 currentcolor;
  }
  50% {
    box-shadow: -.2em 0 0 0 currentcolor;
  }
  62% {
    box-shadow: -.2em -.2em 0 0 currentcolor;
  }
  75% {
    box-shadow: 0px -.2em 0 0 currentcolor;
  }
  87% {
    box-shadow: .2em -.2em 0 0 currentcolor;
  }
`;

export const PageLoaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
`;

export const PageLoader = styled.div`
  transform: rotateZ(45deg);
  perspective: 1000px;
  border-radius: 50%;
  width: 130px;
  height: 130px;
  color: var(--primary);

  &:before,
  &:after {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: inherit;
    height: inherit;
    border-radius: 50%;
    transform: rotateX(70deg);
    animation: 1s ${spin} linear infinite;
  }
  &:after {
    color: var(--black);
    transform: rotateY(70deg);
    animation-delay: 0.4s;
  }
`;

const rotation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const BlurBackground = styled.div`
  position: absolute;
  inset: 0;
  backdrop-filter: blur(3px);
  background: rgba(255, 255, 255, 0.5);
  z-index: 1;
`;

export const ComponentLoaderHolder = styled.div`
  position: relative;
  z-index: 2;
  min-height: ${({ height }) => height && `${height}px`};
`;

export const LoaderWrap = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
`;

export const ComponentLoader = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: inline-block;
  border-top: 3px solid var(--primary);
  border-right: 3px solid transparent;
  box-sizing: border-box;
  animation: ${rotation} 1s linear infinite;
`;

export const Logo = styled.img`
  transform: rotateZ(-45deg) translateY(64px);
  width: 38px;
  height: 38px;
`;

const loadingCircle = keyframes`
  to {
    transform: rotate(1turn);
  }
`;

export const BtnLoader = styled.span`
  margin-right: 12px;
  svg {
    animation: ${loadingCircle} 1s linear infinite;
  }
`;

const pathTriangle = keyframes`
    33% {
        stroke-dashoffset: 74;
    }
    66% {
        stroke-dashoffset: 147;
    }
    100% {
        stroke-dashoffset: 221;
    }
`;

const dotTriangle = keyframes` 
    33% {
        transform: translate(0, 0);
    }
    66% {
        transform: translate(10px, -18px);
    }
    100% {
        transform: translate(-10px, -18px);
    }
`;

const pathRect = keyframes`
    25% {
        stroke-dashoffset: 64;
    }
    50% {
        stroke-dashoffset: 128;
    }
    75% {
        stroke-dashoffset: 192;
    }
    100% {
        stroke-dashoffset: 256;
    }
`;

const dotRect = keyframes`
    25% {
        transform: translate(0, 0);
    }
    50% {
        transform: translate(18px, -18px);
    }
    75% {
        transform: translate(0, -36px);
    }
    100% {
        transform: translate(-18px, -18px);
    }
`;

const pathCircle = keyframes`
    25% {
        stroke-dashoffset: 125;
    }
    50% {
        stroke-dashoffset: 175;
    }
    75% {
        stroke-dashoffset: 225;
    }
    100% {
        stroke-dashoffset: 275;
    }
`;

export const ViewLoader = styled.div`
  --path: var(--primary);
  --dot: var(--dark);
  --duration: 3s;
  width: 44px;
  height: 44px;

  position: relative;
  &:before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    position: absolute;
    display: block;
    background: var(--dot);
    top: 37px;
    left: 19px;
    transform: translate(-18px, -18px);
    animation: ${dotRect} var(--duration) cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite;
  }
  svg {
    display: block;
    width: 100%;
    height: 100%;
    rect,
    polygon,
    circle {
      fill: none;
      stroke: var(--path);
      stroke-width: 10px;
      stroke-linejoin: round;
      stroke-linecap: round;
    }
    polygon {
      stroke-dasharray: 145 76 145 76;
      stroke-dashoffset: 0;
      animation: ${pathTriangle} var(--duration) cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite;
    }
    rect {
      stroke-dasharray: 192 64 192 64;
      stroke-dashoffset: 0;
      animation: ${pathRect} 3s cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite;
    }
    circle {
      stroke-dasharray: 150 50 150 50;
      stroke-dashoffset: 75;
      animation: ${pathCircle} var(--duration) cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite;
    }
  }
  &.triangle {
    width: 48px;
    &:before {
      left: 21px;
      transform: translate(-10px, -18px);
      animation: ${dotTriangle} var(--duration) cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite;
    }
  }
`;
