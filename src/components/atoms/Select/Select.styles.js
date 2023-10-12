import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import styled, { css } from 'styled-components/macro';
import { styles } from '../Input/Input.styles';

const Styles = css`
  .react-select__control {
    ${styles}
    min-height: inherit;
    padding-top: 0;
    padding-bottom: 0;
    border-color: ${({ error }) => error && 'var(--danger) !important'};
    box-shadow: none;
    ${({ $gray }) =>
      $gray &&
      css`
        background: var(--light-secondary);
        border-color: var(--light-secondary);
      `}
    &:hover {
      border-color: var(--light);
    }
    &.react-select__control--is-focused,
    &.react-select__control--menu-is-open {
      border-color: var(--primary);
    }
  }
  .react-select__placeholder {
    color: var(--gray);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: calc(100% - 8px);
  }
  .react-select__value-container {
    padding-left: 0;
    padding-right: 0;
  }
  .react-select__menu {
    box-shadow: 3px 18px 44px rgba(176, 183, 195, 0.28);
    border-radius: 8px;
    border: 1px solid var(--light);
    z-index: var(--z-30);
  }
  .react-select__option {
    font-size: var(--font-size-sm);
    &:active {
      background: var(--light-primary);
    }
  }
  .react-select__option--is-focused {
    background: var(--light-primary);
  }
  .react-select__option--is-selected {
    background: var(--primary);
  }
  ${({ isMulti }) =>
    isMulti &&
    css`
      .react-select__control {
        height: auto;
        min-height: 45px;
      }
      .react-select__option {
        position: relative;
        font-size: 14px;
        padding-left: 42px;
        padding-top: 15px;
        padding-bottom: 15px;
        text-transform: uppercase;
        &:before,
        &:after {
          content: '';
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          border: 1px solid var(--primary);
          border-radius: 5px;
          width: 16px;
          height: 16px;
        }
        &:after {
          content: '\\e876';
          font-family: 'Material Icons Round';
          background: var(--primary);
          opacity: 0;
          visibility: hidden;
          transition: 0.3s linear;
          color: var(--white);
          font-size: 10px;
          line-height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        &.react-select__option--is-selected {
          background: none;
          color: #0f2546;
          &:after {
            opacity: 1;
            visibility: visible;
          }
          &.react-select__option--is-focused {
            background: var(--light-secondary);
          }
        }
      }
      .react-select__multi-value {
        background: #d2ecf1;
        font-size: 12px;
        line-height: 12px;
      }
    `}
`;

export const StyledSelect = styled(Select)`
  ${Styles}
`;

export const StyledSelectAsync = styled(AsyncSelect)`
  ${Styles}
`;
