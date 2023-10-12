import React, { useContext, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import Skeleton from 'react-loading-skeleton';
import { useParams } from 'react-router-dom';
import { useMediaPredicate } from 'react-media-hook';
import { LoadingContext } from 'context/loadingContext';
import { SideNavContext } from 'context/sideNavContext';
import { FiltersContext } from 'context/filtersContext';
import Heading from 'components/atoms/Heading';
import Button from 'components/atoms/Button';
import { StyledHeader, MenuButton, ButtonsHolder } from './Header.styles';

function Header({ title, children, ...props }) {
  const { toggleFilter } = useContext(FiltersContext);
  const { toggleSideNav, sideNavState } = useContext(SideNavContext);
  const { isLoading } = useContext(LoadingContext);
  const MinWidth992 = useMediaPredicate('(min-width: 992px)');
  const MaxWidth991 = useMediaPredicate('(max-width: 991px)');

  useEffect(() => sideNavState && document.body.classList.add('nav-active'), [sideNavState]);
  const { view } = useParams();

  return (
    <>
      <StyledHeader css={isLoading && 'background: transparent;'} profile={view === 'profile'} {...props}>
        {MaxWidth991 && (
          <MenuButton type="button" onClick={toggleSideNav}>
            {isLoading ? (
              <Skeleton rectangle height={16} width={16} />
            ) : (
              <i className="material-icons-outlined">menu</i>
            )}
          </MenuButton>
        )}
        {MinWidth992 && title && view !== 'profile' && (
          <Heading level={2} className="mb-0" css="text-transform: capitalize;">
            {isLoading ? <Skeleton rectangle height={25} width={200} /> : title}
          </Heading>
        )}
        <ButtonsHolder>{children}</ButtonsHolder>
      </StyledHeader>
      {MaxWidth991 && title && view !== 'profile' && (
        <div css="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--gutter);">
          <Heading level={2} css="text-transform: capitalize; margin-bottom: 0;">
            {isLoading ? <Skeleton rectangle height={25} width={200} /> : title}
          </Heading>
          {view !== 'dashboard' && (
            <Button
              type="white"
              width={120}
              prefix={<i className="material-icons-outlined">filter_list</i>}
              onClick={toggleFilter}>
              Filters
            </Button>
          )}
        </div>
      )}
    </>
  );
}

export default Header;
