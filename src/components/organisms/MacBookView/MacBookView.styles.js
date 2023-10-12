// eslint-disable-next-line no-unused-vars
import styled, { css } from 'styled-components/macro';
import MacBookImg from '../../../assets/images/macbook-img.png';
import MobileImg from '../../../assets/images/mobile-img2.png';

export const Wrap = styled.div`
  width: 100%;
  height: 100%;
  padding: 0 10px 0 0;
  overflow-y: auto;
`;

export const SideNav = styled.div`
  position: absolute;
  top: 35px;
  left: 112px;
  width: 36px;
  z-index: 5;

  img {
    display: block;
    width: 100%;
    height: auto;
  }
`;

export const Heading = styled.strong`
  display: block;
  font-size: 13px;
  line-height: 15px;
  margin: 0 0 10px;
`;

export const MapBlock = styled.div`
  width: 100%;
  height: 160px;
  overflow: hidden;
  border-radius: 10px;
  margin: 0 0 12px;
  background: #ccc;
  > div {
    width: 100%;
    height: 160px;
  }
`;

export const MacBookBlock = styled.div`
  width: 976px;
  height: 580px;
  position: relative;
  margin: 0 auto;
  padding: 45px 111px 76px 160px;
  background: url(${MacBookImg}) no-repeat;
  background-size: contain;

  &.panel-active {
    overflow: hidden;
    &:before {
      display: block;
    }
  }

  &:before {
    display: none;
    content: '';
    position: absolute;
    top: 34px;
    bottom: 74px;
    left: 110px;
    right: 110px;
    backdrop-filter: blur(4px);
    background: rgba(50, 59, 75, 0.3);
    z-index: 9;
  }

  ${({ mobileView }) =>
    mobileView &&
    css`
      /* width: 512px;
      height: 877px;
      padding: 70px 70px 45px; */

      width: 390px;
      height: 668px;
      padding: 58px 55px 55px;
      background: url(${MobileImg}) no-repeat;
      background-size: contain;

      &:before {
        display: none !important;
      }

      ${SideNav} {
        display: none;
      }

      ${Wrap} {
        padding: 0 10px;
      }
    `}
`;
