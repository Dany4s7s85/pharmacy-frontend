import React, { useContext, useEffect, useMemo, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import Styled from 'styled-components/macro';

import { useMediaPredicate } from 'react-media-hook';
import { SideNavContext } from 'context/sideNavContext';
import { LoadingContext } from 'context/loadingContext';
import LogoP from 'assets/images/logo-p.svg';
import LogoFull from 'assets/images/logo.svg';
import { AuthContext } from 'context/authContext';
import sideNavData from 'nav.json';
import UserActions from 'components/organisms/UserActions';
import { SideNavbar, Nav, Ul, CloseButton, LogoHolder, Logo, SearchField, StyledField } from './SideNav.styles';
import SubMenu from './SubMenu';

function Navbar() {
  const { toggleSideNav, sideNavState } = useContext(SideNavContext);
  const [searchText, setSearchText] = useState('');
  const { allowedPages } = useContext(AuthContext);
  const { isLoading } = useContext(LoadingContext);
  const MaxWidth991 = useMediaPredicate('(max-width: 991px)');
  useEffect(() => !sideNavState && document.body.classList.remove('nav-active'), [sideNavState]);
  const sideBarItems = useMemo(
    () =>
      sideNavData
        .filter(({ file, live }) =>
          !searchText.trim()
            ? allowedPages.includes(file) && (process?.env?.REACT_APP_MAIN_URL === 'https://plastk.ca' ? live : true)
            : allowedPages.includes(file) &&
              file.includes(searchText.trim()) &&
              (process?.env?.REACT_APP_MAIN_URL === 'https://plastk.ca' ? live : true),
        )
        .map((item, index) => <SubMenu item={item} key={index} />),
    [searchText, isLoading, sideNavData, allowedPages],
  );
  return (
    <>
      <SideNavbar css={isLoading && 'background:var(--dark);'} $loading={isLoading}>
        <LogoHolder>
          <Logo to="/">
            <img src={LogoP} alt="plastk" className="logo-small" />
            <img src={LogoFull} alt="plastk" className="logo-full" />
          </Logo>
        </LogoHolder>
        {MaxWidth991 && (
          <CloseButton onClick={toggleSideNav}>
            <i className="material-icons-outlined">close</i>
          </CloseButton>
        )}
        <SearchField>
          <StyledField
            type="search"
            placeholder="Search..."
            value={searchText}
            onChange={({ target: { value } }) => setSearchText(value)}
            prefix={<i className="material-icons-outlined">search</i>}
          />
        </SearchField>

        <Nav>
          <Ul>{sideBarItems}</Ul>
        </Nav>
        <UserActions
          toggleSideNav={toggleSideNav}
          profile={sideBarItems.filter(item => item.props.item.name === 'Profile')}
        />
      </SideNavbar>
    </>
  );
}
export default Navbar;
