import { AuthContext } from 'context/authContext';
import { SideNavContext } from 'context/sideNavContext';
import React, { useContext, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import {
  Li,
  StyledLink,
  Title,
  StyledSubMenu,
  SubMenuItem,
  SubMenuLink,
  SubMenuTitle,
  ArrowHolder,
} from './SideNav.styles';

function SubMenu({ item, isLoading }) {
  const { toggleSideNav } = useContext(SideNavContext);
  const [subnav, setSubnav] = useState(false);
  const { allowedPages } = useContext(AuthContext);
  const showSubnav = () => setSubnav(!subnav);

  return (
    item.file !== 'profile' && (
      <Li css={isLoading && 'text-align: center;'}>
        {isLoading ? (
          <Skeleton circle height={40} width={40} css="margin: 0 auto;" />
        ) : (
          <>
            <StyledLink
              to={item.hideSelf ? `/admin/${item.file}/${item?.subNav[0]?.file}` : `/admin/${item.file}`}
              onClick={() => {
                showSubnav();
                toggleSideNav();
              }}>
              <i className="icon material-icons-outlined">{item.icon}</i>
              <Title>{item.name}</Title>
              {item.subNav && subnav ? (
                <ArrowHolder>
                  <span className="material-icons-outlined">arrow_drop_up</span>
                </ArrowHolder>
              ) : item.subNav ? (
                <ArrowHolder>
                  <span className="material-icons-outlined">arrow_drop_down</span>
                </ArrowHolder>
              ) : null}
            </StyledLink>
          </>
        )}
        {subnav && (
          <StyledSubMenu>
            {item?.subNav
              ?.filter(
                ({ file, live }) =>
                  allowedPages.includes(file) && (process.env.REACT_APP_MAIN_URL === 'https://plastk.ca' ? live : true),
              )
              .map((subNavItem, index) => (
                <SubMenuItem key={index}>
                  <SubMenuLink to={`/admin/${item?.file}/${subNavItem?.file}`}>
                    <i className="icon material-icons-outlined">{subNavItem.icon}</i>
                    <SubMenuTitle>{subNavItem.name}</SubMenuTitle>
                  </SubMenuLink>
                </SubMenuItem>
              ))}
          </StyledSubMenu>
        )}
      </Li>
    )
  );
}

export default SubMenu;
