import styled from 'styled-components/macro';
import heartimg from '../../../assets/images/heart-img.png';

export const StyledStoreColumn = styled.div`
  display: block;
  padding: 10px;
  border-radius: 16px;
  border: 1px solid #edeff3;
  /* box-shadow: 0px 23px 44px rgba(176, 183, 195, 0.14); */
  background: var(--white);
  cursor: pointer;
`;

export const ImgBox = styled.div`
  overflow: hidden;
  width: 100%;
  height: 90px;
  border-radius: 10px;
  margin-bottom: 10px;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const TextBox = styled.div`
  overflow: hidden;
  margin-bottom: 15px;
`;

export const Title = styled.strong`
  display: block;
  font-size: var(--font-size-xs);
  line-height: 15px;
  text-transform: capitalize;
  font-weight: 700;
  margin-bottom: 5px;
  color: var(--secondary-text-color);
`;

export const SubTitle = styled.strong`
  display: block;
  font-size: 10px;
  line-height: 12px;
  text-transform: capitalize;
  color: var(--text-color-gray);
`;

export const Ul = styled.ul`
  display: flex;
  justify-content: space-between;
  list-style: none;
  margin: 0 -4px;
  padding: 0;
  font-size: 10px;
  line-height: 12px;
  display: flex;
  color: var(--secondary);
`;

export const Li = styled.li`
  display: flex;
  align-items: center;
  padding: 0 4px;
  position: relative;
`;

export const Img = styled.img`
  display: block;
  width: 16px;
  height: 16px;
  margin-right: 6px;
`;

export const PointText = styled.span`
  display: block;
  font-size: var(--font-size-xs);
  line-height: 14px;
  color: var(--secondary-text-color);
`;

export const Icon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  font-size: 13px;
  line-height: 1;
  color: var(--white);
  border-radius: 7px;
  background: var(--primary);
`;

export const HeartIcon = styled.div`
  position: absolute;
  right: -15px;
  bottom: -20px;
  width: 60px;
  height: 60px;
  pointer-events: none;
  background: url(${heartimg}) no-repeat;
  background-position: 0 0;
  background-size: cover;
  /* cursor: pointer; */
  transition: background-position 1s steps(28);
  transition-duration: 0s;
  &.is-active {
    transition-duration: 1s;
    background-position: -1680px 0;
  }
`;
