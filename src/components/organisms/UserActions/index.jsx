import React, { useState, useContext } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import Skeleton from 'react-loading-skeleton';
import { LoadingContext } from 'context/loadingContext';
import { SideNavContext } from 'context/sideNavContext';
import { AuthContext } from 'context/authContext';
import Avatar from 'assets/images/avatar-img01.png';
import {
  ProfileHolder,
  UserWrap,
  ImgBox,
  TextBox,
  DropDown,
  Ul,
  Li,
  StyledLink,
  Name,
  Text,
  IconHolder,
} from './UserActions.styles';

function UserActions({ profile }) {
  const { toggleSideNav } = useContext(SideNavContext);
  const { onLogout, user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const { isLoading } = useContext(LoadingContext);
  return (
    <>
      {isLoading ? (
        <Skeleton circle height={40} width={40} />
      ) : (
        <ProfileHolder>
          <UserWrap onClick={() => setIsOpen(!isOpen)}>
            <ImgBox>
              <img src={Avatar} width="40" height="40" alt="user" />
            </ImgBox>

            <TextBox>
              <Name>{user?.username}</Name>
            </TextBox>
            <i className="icon-chevron-down material-icons-outlined">expand_more</i>
          </UserWrap>

          <DropDown dropdownOpen={isOpen}>
            <Ul>
              <Li index="1">
                {profile.map((fileName, index) => (
                  <StyledLink
                    to={`/admin/${fileName.props.item.file}`}
                    key={index}
                    onClick={() => {
                      toggleSideNav();
                    }}>
                    <IconHolder>
                      <i className="material-icons-outlined">person</i>
                    </IconHolder>
                    <Text>Profile</Text>
                    <i className="material-icons-outlined">chevron_right</i>
                  </StyledLink>
                ))}
              </Li>
              <Li index="2">
                <StyledLink
                  as="span"
                  css="cursor: pointer;"
                  onClick={e => {
                    e.preventDefault();
                    toggleSideNav();
                    onLogout();
                  }}>
                  <IconHolder>
                    <i className="material-icons-outlined">logout</i>
                  </IconHolder>
                  <Text>Logout</Text>
                </StyledLink>
              </Li>
            </Ul>
          </DropDown>
        </ProfileHolder>
      )}
    </>
  );
}

export default UserActions;
