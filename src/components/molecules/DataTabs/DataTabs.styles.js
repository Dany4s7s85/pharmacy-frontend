// eslint-disable-next-line no-unused-vars
import styled, { css } from 'styled-components/macro';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@reach/tabs';

export const Wrap = styled.div`
  overflow: hidden;
  border-bottom: 1px solid #e6e8ec;
  margin-bottom: 20px;
  @media (max-width: 991px) {
    overflow-x: auto;
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const StyledTabList = styled(TabList)`
  display: flex;
  white-space: nowrap;
  margin: 0;
  position: relative;

  &[aria-orientation='vertical'] {
    flex-direction: column;
    &:after {
      display: none;
    }
  }

  @media (min-width: 992px) {
    white-space: normal;
    margin: 0;
    padding: 0;
  }
`;

export const TabBtn = styled.div`
  padding: 0 15px;

  &:first-child {
    padding-left: 0;
  }

  &:last-child {
    padding-right: 0;
  }
`;

export const StyledTab = styled(Tab)`
  font-size: var(--font-size-sm);
  line-height: 16px;
  font-weight: 700;
  text-transform: capitalize;
  color: var(--text-color-gray);
  position: relative;
  padding: 10px 0;
  &[data-orientation='vertical'] {
    text-align: left;
    width: 100%;
  }

  &:after {
    visibility: hidden;
    opacity: 0;
    transition: ease-in-out 0.5s;
    content: '';
    position: absolute;
    left: 50%;
    right: 0;
    bottom: 0;
    transform: translateX(-50%);
    height: 1px;
    width: 0;
    background: var(--secondary-text-color);
  }

  &:hover,
  &[data-selected] {
    color: var(--secondary-text-color);

    &:after {
      visibility: visible;
      opacity: 1;
      width: 100%;
    }
  }
`;
export const StyledTabPanels = styled(TabPanels)`
  /* overflow: hidden; */
`;

export const StyledTabPanel = styled(TabPanel)`
  position: relative;
`;

export const TabListHolder = styled.div``;

export const StyledTabs = styled(Tabs)`
  flex-grow: 1;
  ${({ white }) =>
    white &&
    css`
      ${StyledTab} {
        color: var(--white);
        font-weight: bold;
        padding: 10px 10px 20px;
        &:after {
          background: var(--white);
          height: 5px;
        }
      }
    `}
  &[data-orientation='horizontal'] {
    ${TabListHolder} {
      position: relative;
      @media (max-width: 991px) {
        &:after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 35px;
          background: linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.1) 100%);
          backdrop-filter: blur(4px);
        }
      }
    }
    ${TabBtn} {
      &:last-child {
        padding-right: 40px;
      }
    }
  }
  &[data-orientation='vertical'] {
    flex-grow: 0;
    display: flex;
    padding-bottom: 30px;
    ${StyledTabPanels} {
      flex-grow: 1;
      overflow-x: auto;
      padding: 0 0 0 20px;
    }
    ${TabBtn} {
      padding: 0;
    }
    ${Wrap} {
      border-right: 1px solid var(--light-gray);
      padding-right: 10px;
      overflow-x: hidden;
      overflow-y: auto;
      max-height: 500px;
      width: 200px;
      flex-shrink: 0;
      border-bottom: none;
      margin-bottom: 0;
      &::-webkit-scrollbar {
        display: block;
        width: 4px;
      }
    }
  }
`;
