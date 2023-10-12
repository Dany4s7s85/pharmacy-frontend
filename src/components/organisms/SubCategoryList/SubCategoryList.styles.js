import styled from 'styled-components/macro';

export const Heading = styled.strong`
  display: block;
  font-size: 13px;
  line-height: 15px;
  margin: 0 0 8px;
`;

export const ListStyle = styled.ul`
  display: flex;
  align-items: center;
  list-style: none;
  padding: 0 0 5px;
  margin: 0 auto 12px;
  color: var(--black);
  overflow-x: auto;
  font-size: 10px;
  line-height: 12px;

  &::-webkit-scrollbar {
    height: 3px;
  }
`;

export const Li = styled.li`
  flex-shrink: 0;
  padding: 0 3px;
`;

export const Button = styled.button`
  display: inline-block;
  vertical-align: top;
  color: var(--black);
  padding: 5px 10px;
  transition: linear 0.2s;
  border-radius: 100px;
  position: relative;
  z-index: 1;

  &:hover,
  &.active {
    color: var(--white);

    &:before {
      visibility: visible;
      opacity: 1;
      transform: scale(1);
    }
  }

  &:before {
    visibility: hidden;
    opacity: 0;
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    transform: scale(0);
    transition: linear 0.2s;
    border-radius: 30px;
    background: rgba(171, 223, 101, 1);
    z-index: -1;
  }
`;
