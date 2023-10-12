import styled from 'styled-components/macro';
import { Menu, MenuButton, MenuList, MenuItem } from '@reach/menu-button';
import '@reach/menu-button/styles.css';

export const StyledMenu = styled(Menu)``;

export const StyledMenuButton = styled(MenuButton)`
  padding: 5px;
`;

export const StyledMenuList = styled(MenuList)`
  &[data-reach-menu-list],
  &[data-reach-menu-items] {
    border: none;
    box-shadow: 3px 18px 44px rgba(176, 183, 195, 0.28);
    padding: 0.5rem 0;
    border-radius: 0.5rem;
    background: var(--white);
    color: var(--primary-text-color);
  }
`;

export const StyledMenuItem = styled(MenuItem)`
  &[data-reach-menu-item] {
    display: flex;
    align-items: center;
    &[data-selected] {
      background: var(--primary);
    }
  }

  [class^='material-icons-'],
  [class*=' material-icons-'] {
    margin-right: 0.5rem;
  }
`;
