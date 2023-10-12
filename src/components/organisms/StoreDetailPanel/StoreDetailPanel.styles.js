import styled, { css } from 'styled-components/macro';

export const ButtonClose = styled.button`
  position: absolute;
  top: 30px;
  right: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  font-size: 20px;
  line-height: 1;
  color: #160f46;
  border-radius: 100%;
  background: var(--white);
`;

export const Btn = styled.a`
  display: block;
  width: 100%;
  font-size: 11px;
  line-height: 15px;
  font-weight: 500;
  color: var(--purple-dark);
  text-align: center;

  @media (min-width: 576px) {
    font-size: 11px;
  }
`;

export const List = styled.ul`
  list-style: none;
  padding: 10px 0 0;
  margin: 0 -10px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  li {
    flex-grow: 1;
    padding: 0 3px;
  }
`;

export const Ico = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  font-size: 16px;
  line-height: 1;
  color: var(--purple-dark);
  border: 1px solid var(--purple-dark);
  border-radius: 100%;
  margin: 0 auto 5px;

  &.icon-call {
    font-size: 13px;
  }
`;

export const StoreImgBox = styled.div`
  width: 100%;
  overflow: hidden;
  border-radius: 10px;
  margin-bottom: 15px;
  height: 210px;
  border: 1px solid #edeff3;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const Status = styled.strong`
  position: absolute;
  top: 8px;
  right: 10px;
  font-size: 11px;
  line-height: 12px;
  font-weight: 700;
  text-transform: capitalize;
  color: #6180f2;
`;

export const StoreName = styled.div`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  position: relative;
  border: 1px solid #edeff3;
  box-shadow: 0px 23px 44px rgba(176, 183, 195, 0.14);
  border-radius: 12px;
`;

export const Title = styled.strong`
  display: block;
  font-size: 13px;
  line-height: 16px;
  font-weight: 700;
  text-transform: capitalize;
  color: var(--secondary-text-color);
  margin-bottom: 10px;
`;

export const Ul = styled.ul`
  display: flex;
  font-size: 14px;
  line-height: 15px;
  font-weight: 700;
  color: var(--secondary-text-color);
  margin-bottom: 0;

  &.rating {
    align-items: center;
    .star {
      line-height: 24px !important;

      span {
        font-size: 15px !important;
      }
    }
  }
`;

export const Li = styled.li`
  font-size: 14px !important;
  padding: 0 3px;
`;

export const SpecialOffer = styled.div`
  position: relative;
  color: var(--white);
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-radius: 10px;
  background: ${({ offer }) =>
    offer === 'percentBased'
      ? 'linear-gradient(180deg, #A4ADF1 0%, #707BBF 100%)'
      : offer === 'dollarBased'
      ? 'linear-gradient(180deg, #BFA4F1 0%, #8C70BF 100%)'
      : offer === 'initialOffer'
      ? 'linear-gradient(180deg, #A0D800 0%, #19383A 100%)'
      : 'linear-gradient(180deg, #A4F1B1 0%, #70BF8D 100%)'};

  ${Title} {
    font-size: 12px;
    line-height: 16px;
    font-weight: ${({ offer }) => (offer === 'initialOffer' ? '700' : '500')};
    text-transform: capitalize;
    color: var(--white);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    padding: 10px 15px 8px;
    margin: 0 0 5px;
  }
`;

export const Holder = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const TextBox = styled.div`
  padding-right: 5px;
  br {
    @media (max-width: 767px) {
      display: none;
    }
  }
`;

export const PointsCol = styled.div`
  font-size: 8px;
  line-height: 18px;
  text-align: center;
  flex-shrink: 0;
  @media (max-width: 767px) {
    margin-bottom: 10px;
  }
`;

export const Box = styled.div`
  width: 80px;
  height: 80px;
  padding: 5px;
  margin: 0 auto 5px;
  border-radius: 100%;
  background: ${({ offer }) =>
    offer === 'percentBased'
      ? 'linear-gradient(180deg, rgba(112, 123, 191, 0.3) 0%, rgba(164, 173, 241, 0.3) 100%);'
      : offer === 'dollarBased'
      ? 'linear-gradient(143.33deg, rgba(140, 112, 191, 0.3) 14.19%, rgba(191, 164, 241, 0.3) 83.99%);'
      : offer === 'initialOffer'
      ? 'linear-gradient(180deg, rgba(160, 216, 0, 0.3) 0%, rgba(25, 56, 58, 0.3) 100%);'
      : 'linear-gradient(180deg, rgba(112, 191, 141, 0.3) 0%, rgba(164, 241, 177, 0.3) 100%)'};
`;

export const Inner = styled.div`
  width: 70px;
  height: 70px;
  padding: 5px;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  border-radius: 100%;
  box-shadow: 0px 20px 70px rgba(0, 0, 0, 0.05);
  background: ${({ offer }) =>
    offer === 'percentBased'
      ? 'linear-gradient(180deg, #707BBF 0%, #A4ADF1 100%);'
      : offer === 'dollarBased'
      ? 'linear-gradient(143.33deg, #8C70BF 14.19%, #BFA4F1 83.99%);'
      : offer === 'initialOffer'
      ? 'linear-gradient(0deg, #A0D800 0%, #19383A 100%);'
      : 'linear-gradient(180deg, #70BF8D 0%, #A4F1B1 100%);'};
`;

export const Points = styled.strong`
  display: block;
  font-size: 12px;
  line-height: 14px;
  font-weight: 700;
`;
export const PointText = styled.span`
  display: block;
  font-weight: 700;
`;
export const Date = styled.span`
  display: block;
  font-size: 8px;
  line-height: 10px;
  letter-spacing: 0.5px;
`;
export const TCText = styled.span`
  display: block;
  font-size: 8px;
  line-height: 10px;
  letter-spacing: 0.5px;
  font-weight: 600px;
`;

export const Heading = styled.strong`
  display: block;
  font-size: 13px;
  line-height: 16px;
  font-weight: ${({ offer }) => (offer === 'initialOffer' ? '700' : '500')};
  margin-bottom: 8px;
`;
export const SubText = styled.span`
  display: block;
  font-size: 10px;
  line-height: 14px;
  font-weight: 500;
  .bolder {
    font-weight: 700;
  }
`;

export const Text = styled.span`
  display: block;
  font-size: 8px;
  line-height: 12px;
  font-weight: 400;
  text-transform: capitalize;
`;

export const StoreAddress = styled.div`
  overflow: hidden;
  padding: 0 0 0 1px;
  .icon-phonecall {
    span {
      font-size: 16px;
    }
  }
`;
export const Item = styled.div`
  display: flex;
  /* flex-flow: wrap; */
  align-items: center;
  margin-bottom: 15px;
  color: var(--secondary-text-color);
  position: relative;

  ${Text} {
    font-size: 10px !important;
    line-height: 13px;
  }
`;

export const Icon = styled.span`
  display: block;
  font-size: 14px;
  line-height: 1;
  margin-right: 8px;
  color: var(--purple-dark);
`;

export const Link = styled.a`
  display: block;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 10px;
  line-height: 13px;
  color: var(--secondary-text-color);
`;

export const ReviewBlock = styled.div`
  overflow: hidden;

  ${Title} {
    display: block;
    font-size: 13px;
    line-height: 15px;
    color: var(--secondary-text-color);
    margin-bottom: 10px;
  }
`;

export const ReviewHolder = styled.div`
  position: relative;
  display: flex;
  margin-bottom: 15px;
`;

export const ImgHolder = styled.div`
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: 100%;

  img {
    display: block;
    width: 100%;
    height: auto;
  }
`;

export const TextArea = styled.div`
  flex-grow: 1;
  padding: 0 0 0 10px;
  font-size: 10px;
  line-height: 12px;
  color: #6f7c97;
`;

export const Paragraph = styled.p`
  font-size: 10px;
  line-height: 13px;
`;

export const Name = styled.strong`
  display: block;
  font-size: 12px;
  line-height: 15px;
  text-transform: capitalize;
  margin-bottom: 5px;
  color: var(--secondary-text-color);
`;
export const TimeList = styled.ul`
  list-style: none;
  margin: 0;
  width: 100%;
  visibility: hidden;
  opacity: 0;
  max-height: 0;
  transition: all ease-in-out 0.5s;
  font-size: 10px;
  line-height: 13px;
  padding: 8px 0 0 22px;
  overflow: hidden;

  .active & {
    visibility: visible;
    opacity: 1;
    max-height: 1000px;
  }
  li {
    padding: 3px 0;
  }
`;
export const OpenerIcon = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  font-size: 12px;
  line-height: 1;
`;

export const FlexHolder = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1px 15px;

  @media (max-width: 767px) {
    flex-direction: column-reverse;
  }
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px 0;
`;

export const StyledStore = styled.div`
  position: fixed;
  top: 95px;
  left: 132px;
  bottom: 74px;
  width: 350px;
  padding: 20px 15px;
  overflow-y: auto;
  background: var(--white);
  box-shadow: 0px 23px 44px rgba(176, 183, 195, 0.14);
  z-index: var(--z-40);

  ${({ offer }) => offer === 'initialOffer' && 'font-family: var(--plus-jakarta-font);'}

  ${({ mobileView }) =>
    mobileView &&
    css`
      width: 282px;
      top: 110px;
      left: 369px;
      bottom: 55px;
      padding: 20px 10px;
      box-shadow: none;

      @media (min-width: 576px) {
        width: 282px;
      }

      ${StoreImgBox} {
        height: 210px;
      }

      ${Date},
      ${TCText} {
        font-size: 6px;
        line-height: 9px;
        font-weight: 600px;
      }
    `}
`;

export const VisitTrack = styled.div`
  display: flex;
  width: 100%;
  list-style: none;
  height: 8px;
  margin-top: 5px;
  padding: 0;
  position: relative;
  overflow: hidden;
  border-radius: 25px;
  background: ${({ offer }) =>
    offer === 'initialOffer'
      ? 'linear-gradient(180deg, #19383A -62.5%, #A0D800 100%);'
      : 'linear-gradient(180deg, #70bf8d 0%, #a4f1b1 100%)'};
`;

export const TrackBar = styled.li`
  flex-grow: 1;
  cursor: pointer;
  position: relative;
  /* background: var(--white); */

  &:first-child {
    &:before {
      display: none;
    }
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 1px;
    height: 8px;
    background: #fff;
  }
  &.active {
    background: #fff;
  }
  &.active:before {
    background: #a0d800;
  }
`;
export const OfferDetailsBox = styled.div``;

export const OfferList = styled.ul`
  list-style: none;
  margin: 0;
  width: 100%;
  /* visibility: hidden; */
  /* opacity: 0; */
  /* max-height: 0; */
  transition: all ease-in-out 0.5s;
  font-size: ${({ mobileView }) => (mobileView ? '9px' : '11px')};
  line-height: 13px;
  padding: 0px 0 8px 4px;
  overflow: hidden;

  .active & {
    visibility: visible;
    opacity: 1;
    max-height: 1000px;
  }
  li {
    padding: 3px 0;
    span {
      padding-right: 2px;
    }
    // .points {
    //   font-weight: bold;
    // }
  }
`;

export const FlexBox = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  cursor: pointer;
`;
