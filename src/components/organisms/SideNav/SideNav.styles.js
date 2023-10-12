import styled, { css } from 'styled-components/macro';
import { NavLink, Link } from 'react-router-dom';
import {
  ProfileHolder,
  UserWrap,
  TextBox,
  ImgBox,
  DropDown,
} from 'components/organisms/UserActions/UserActions.styles';
import Field from '../../molecules/Field';

export const LogoHolder = styled.div`
  background: #161a24;
  margin: -30px -15px 0 -15px;
  padding: 15px 25px;
  height: 56px;
`;

export const Logo = styled(Link)`
  width: 100px;
  height: 36px;
  .logo-full {
    width: 71px;
    @media (min-width: 992px) {
      width: 0;
      visibility: hidden;
      opacity: 0;
      transition: all 0.3s ease-in-out;
    }
  }
  .logo-small {
    display: none;
    @media (min-width: 992px) {
      display: block;
      transition: all 0.3s ease-in-out;
      width: 25px;
    }
  }
`;

export const SearchField = styled.div`
  position: relative;
  padding: 20px 0 0;
  margin-left: -7px;
`;

export const StyledField = styled(Field)`
  position: relative;
  height: 40px;
  color: var(--white);
  border-radius: 25px;
  border: 1px solid var(--light);
  background: var(--dark);

  &::placeholder {
    color: var(--white);
  }
`;

export const Nav = styled.nav`
  flex-grow: 1;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  margin: 0 -15px;
  padding-top: 10px;

  &::-webkit-scrollbar {
    width: 5px;
  }
`;

export const Ul = styled.ul`
  list-style: none;
  font-size: var(--font-size-xs);
  line-height: 20px;
  font-weight: 700;
  text-transform: capitalize;
`;

export const Li = styled.li`
  padding: 10px 0;
`;

export const StyledLink = styled(NavLink)`
  display: flex;
  align-items: center;
  color: var(--text-color-gray);
  position: relative;
  transition: none;
  padding: 5px 21px;
  transition: linear 0.3s;

  &:before {
    visibility: hidden;
    opacity: 0;
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 3px;
    height: 25px;
    border-radius: 0px 20px 20px 0px;
    transition: linear 0.3s;
    background: var(--primary);
  }

  &:hover,
  &.active {
    color: var(--primary);

    &:before {
      visibility: visible;
      opacity: 1;
    }
  }

  i.icon {
    display: inline-block;
    font-size: 25px;
    line-height: 1;
    margin: 0;
    transition: linear 0.3s;
  }
`;

export const Title = styled.span`
  position: relative;
  left: 15px;
  white-space: nowrap;
  transition: linear 0.3s;

  @media (min-width: 992px) {
    width: 0;
    left: 30px;
    visibility: hidden;
    opacity: 0;
  }
`;

export const StyledSubMenu = styled.ul`
  background: #161a24;
  font-size: 14px;
  .icon {
    display: inline-block;
    font-size: 25px;
    line-height: 1;
    margin: 0;
    transition: linear 0.3s;
    margin-right: 10px;
  }
`;

export const ArrowHolder = styled.span`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 12px;
  font-size: 20px;
`;

export const SideNavbar = styled.div`
  display: flex;
  flex-flow: column;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 30px 15px;
  transform: translateX(-100%);
  background: var(--dark);
  transition: linear 0.3s;
  z-index: var(--z-40);

  .nav-active & {
    transform: translateX(0);
  }

  @media (min-width: 576px) {
    width: 275px;
  }

  &:not(:hover) {
    ${DropDown}, ${StyledSubMenu},${ArrowHolder} {
      @media (min-width: 992px) {
        display: none;
      }
    }
  }

  @media (min-width: 992px) {
    left: 0;
    width: 72px;
    transform: none;

    ${({ $loading }) =>
      !$loading &&
      css`
        &:hover,
        &.hover {
          width: 275px;

          ${Logo} {
            .logo-full {
              width: 71px;
              visibility: visible;
              opacity: 1;
            }
            .logo-small {
              width: 0;
              visibility: hidden;
              opacity: 0;
            }
          }

          ${StyledLink} {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            border-radius: 0;
            position: relative;
            background: none;
            padding-left: 15px;
            padding-right: 15px;

            &:before {
              left: 0;
            }
          }

          i.icon {
            margin-right: 10px;
          }

          ${UserWrap} {
            padding: 10px;
          }

          ${Title} {
            opacity: 1;
            visibility: visible;
            width: auto;
            left: 0;
          }

          ${ProfileHolder} {
            max-width: 190px;
          }

          ${ImgBox} {
            padding: 0;
            img {
              width: 40px;
              height: 40px;
            }
          }

          ${TextBox} {
            display: block;
          }
        }
      `}
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 20px;
  width: 24px;
  height: 24px;
  color: var(--white);
  font-size: 25px;
  line-height: 1;
`;

export const SubMenuItem = styled.li``;

export const SubMenuLink = styled(NavLink)`
  padding: 10px 10px 10px 55px;
  color: var(--text-color-gray);
  display: flex;
  align-items: center;
  &:hover,
  &.active {
    color: var(--primary);
  }
`;

export const SubMenuTitle = styled.span``;
