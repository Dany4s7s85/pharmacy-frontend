import styled, { css } from 'styled-components/macro';

export const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--dark);
  padding: 1.25rem;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: var(--z-35);
  border-bottom: 1px solid var(--border-color);
  @media (min-width: 992px) {
    background: none;
    padding: 0 0 0.9375rem;
    position: static;
  }
  ${({ profile }) =>
    profile &&
    css`
      @media (min-width: 992px) {
        display: none;
      }
    `}
`;

export const ButtonsHolder = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 0 -5px;

  @media (min-width: 992px) {
    margin: 0 -5px;
  }
  > * {
    margin: 0 5px 0;
    @media (min-width: 992px) {
      margin: 0 5px;
    }
    @media (max-width: 1199px) {
      flex-shrink: 0;
    }
    @media (max-width: 575px) {
      padding: 0;
    }
    @media (min-width: 1200px) {
      &:not(:last-child) {
        width: auto;
        flex-shrink: 0;
      }
    }
  }
  @media (max-width: 991px) {
    [class^='icon-'],
    [class*=' icon-'] {
      color: var(--text-color-gray);
    }
  }
`;

export const MenuButton = styled.button`
  display: flex;
  color: var(--white);
  font-size: 25px;
  line-height: 1;
`;
