import styled from 'styled-components/macro';

// export const StyledList = styled.ul`
//   list-style: none;
//   margin: 0 0 16px;
//   padding: 0 0 4px;
//   position: relative;
//   display: flex;
//   flex-flow: nowrap;
//   white-space: nowrap;
//   overflow-x: auto;
//   text-align: center;

//   &::-webkit-scrollbar {
//     /* display: none; */
//     height: 4px;
//   }
// `;

// export const Li = styled.li`
//   position: relative;
//   padding: 0 8px;
// `;
export const Title = styled.strong`
  display: block;
  font-size: 10px;
  line-height: 12px;
  font-weight: 700;
  text-transform: capitalize;
  color: var(--secondary-text-color);
`;

export const SwiperHolder = styled.div`
  .swiper-container {
    padding-left: ${({ mobileView }) => (mobileView ? '0' : '40px')};
    padding-right: ${({ mobileView }) => (mobileView ? '0' : '40px')};
  }
  .category-swiper {
    margin: 0 0 30px;
  }
  .swiper-button-next,
  .swiper-button-prev {
    color: var(--primary);
    background: var(--white);
    width: 30px;
    height: 30px;
    border: 1px solid #eee;
    border-radius: 5px;
    box-shadow: 3px 3px 3px 0 rgba(0, 0, 0, 0.2);
    &:after {
      font-size: 18px;
    }
  }

  .swiper-button-prev {
    left: 5px;
  }
  .swiper-button-next {
    right: 5px;
  }
  .swiper-slide {
    padding: 0 10px !important;
    margin: 0 !important;
  }
  ${Title} {
    font-size: 9px !important;
  }
`;

export const ImgBox = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 8px;
  border-radius: 100px;
  border: 1px solid var(--primary);
  margin: 0 auto 5px;
  box-sizing: border-box;

  img {
    filter: drop-shadow(0 0 5px rgba(255, 255, 255, 1));
  }
`;

export const Box = styled.span`
  display: block;
  text-align: center;

  &:hover,
  &.active {
    ${ImgBox} {
      color: var(--white);
      background: #abdf65b5;
      cursor: pointer;
    }
  }
`;

export const Icon = styled.span`
  display: block;
  font-size: 22px;
  line-height: 1;
`;
