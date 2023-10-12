import styled from 'styled-components/macro';
import InfiniteScroll from 'react-infinite-scroll-component';

import MenuButton from 'components/molecules/MenuButton';

export const NotificationsContainer = styled.div`
  position: relative;
`;

export const NotificationsHolder = styled.div`
  background: var(--white);
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  z-index: var(--z-45);
  padding: 20px 5px 5px 10px;
  width: 300px;
  box-shadow: 0px 23px 44px rgba(176, 183, 195, 0.14);
  @media (min-width: 768px) {
    width: 360px;
  }
`;

export const BtnHolder = styled.span`
  display: flex;
  align-items: center;
`;

export const FlexWrap = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const Date = styled.span`
  display: block;
`;

export const BtnRead = styled.strong`
  display: block;
  font-size: 11px;
  line-height: 13px;
  font-weight: 700;
  text-transform: capitalize;
  padding: 3px 5px;
  margin-top: 5px;
  cursor: pointer;
  border-radius: 3px;
  border: 1px solid var(--primary);
`;

export const Heading = styled.strong`
  display: block;
  font-size: 18px;
  line-height: 22px;
  text-transform: capitalize;
`;

export const StyledInfiniteScroll = styled(InfiniteScroll)`
  padding-right: 10px;

  &::-webkit-scrollbar {
    width: 4px;
  }
`;

export const MenuHolder = styled.div`
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
`;

export const StyledMenuButton = styled(MenuButton)`
  background: var(--light-gray);
  color: var(--white);
  border-radius: 100%;
  width: 25px;
  height: 25px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
`;

export const NotificationItem = styled.div`
  font-size: var(--font-size-sm);
  line-height: calc(var(--line-height-sm) + 0.3125rem);
  padding: 8px 50px 8px 0;
  position: relative;
  opacity: 0.8;
  font-size: 12px;

  &.active {
    background: var(--white);

    opacity: 1;
    &:after {
      content: '';
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      background: var(--primary);
      width: 8px;
      height: 8px;
      border-radius: 100%;
    }
    ${Date} {
      color: var(--primary);
    }
  }
`;

export const Empty = styled.span`
  text-align: center;
  display: block;
  span {
    display: block;
    margin-bottom: 12px;
    font-size: 30px;
    color: var(--primary);
  }
`;

export const Head = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;
