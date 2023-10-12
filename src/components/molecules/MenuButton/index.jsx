// TODO: fix calender positioning
import React from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';

import { StyledMenu, StyledMenuButton, StyledMenuList, StyledMenuItem } from './MenuButton.styles';

export const MenuItem = ({ children, icon, ...props }) => (
  <StyledMenuItem onSelect={() => {}} {...props}>
    {icon ?? null}
    {children}
  </StyledMenuItem>
);

const MenuButton = React.forwardRef(({ children, icon, portal, ...props }, ref) => (
  <>
    <StyledMenu>
      <StyledMenuButton {...props}>{icon}</StyledMenuButton>
      <StyledMenuList portal={portal} ref={ref}>
        {children}
      </StyledMenuList>
    </StyledMenu>
  </>
));

export default MenuButton;
