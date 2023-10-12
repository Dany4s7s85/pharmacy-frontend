// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';

export const SwitcherBtns = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  overflow: hidden;
  width: 100px;
  margin: 0 auto 20px;
`;

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 40px;
  font-size: 22px;
  line-height: 1;
  padding: 5px;
  color: var(--light-gray2);
  outline: none;
  box-shadow: none;
  border: 0;
  transition: 0.3s linear;
  background: var(--light-secondary);

  &.active,
  &:focus,
  &:hover {
    background: var(--primary-text-color);
    color: var(--white);
    outline: none;
    box-shadow: none;
    border: 0;
  }
`;
