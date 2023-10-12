import styled, { css } from 'styled-components/macro';
import { darken, cssVar } from 'polished';
import FakeInput from '../FakeInput';

export const styles = css`
  border: 2px solid ${({ $invalid }) => ($invalid ? 'var(--danger)' : 'var(--light)')};
  background: var(--white);
  outline: none;
  height: ${({ sm }) => (sm ? '40px' : '50px')};
  padding: ${({ sm }) => (sm ? '0.3125rem .9375rem' : 'var(--form-element-padding)')};
  width: 100%;
  transition: border var(--animation-speed) ease-in-out;
  color: var(--secondary-text-color);
  font-size: var(--font-size-sm);
  border-radius: ${({ $rounded }) => ($rounded ? '85px' : '6px')};
  padding-left: ${({ $prefix }) => $prefix && '2.5rem'};
  padding-right: ${({ $suffix, $button }) => {
    if ($suffix) return '2.5rem';
    if ($button) return '3.6rem';
    return '';
  }};

  ${({ type }) =>
    type === 'search' &&
    css`
      transition: all var(--animation-speed) ease-in-out;

      ${({ responsive }) =>
        responsive &&
        css`
          @media (max-width: 767px) {
            position: absolute;
            top: -22px;
            right: 7px;
            z-index: 9;
            box-shadow: 0px 23px 44px rgba(176, 183, 195, 0.3);
            background: var(--white);
            border: 1px solid var(--light);
            opacity: 0;
            visibility: hidden;
            transform: translateX(10px);
            width: 0;
          }
          @media (max-width: 575px) {
            top: 100%;
            left: 0;
            right: 0;
            width: 100%;
          }
        `}

      ${({ openSearch }) =>
        openSearch &&
        css`
          @media (max-width: 767px) {
            opacity: 1;
            visibility: visible;
            transform: translateX(0);
            width: 350px;
          }
          @media (max-width: 575px) {
            transform: translateY(0);
            width: 100%;
          }
        `}
    `}

  ${({ disabled }) =>
    disabled &&
    css`
      background: var(--light);
      cursor: not-allowed;
      border-color: var(--gray-2);
      color: var(--light-gray);
    `}

  &:focus {
    border-color: ${({ $invalid }) => !$invalid && `${darken(0.1, cssVar('--primary'))}`};
  }

  ::-webkit-input-placeholder {
    /* Chrome/Opera/Safari */
    color: var(--secondary-text-color);
    opacity: 0.6;
  }
  ::-moz-placeholder {
    /* Firefox 19+ */
    color: var(--secondary-text-color);
    opacity: 0.6;
  }
  :-ms-input-placeholder {
    /* IE 10+ */
    color: var(--secondary-text-color);
    opacity: 0.6;
  }
  :-moz-placeholder {
    /* Firefox 18- */
    color: var(--secondary-text-color);
    opacity: 0.6;
  }

  &[type='radio'] {
    + ${FakeInput} {
      border-radius: 100%;
      &:before {
        content: '';
        background: var(--white);
        border-radius: 100%;
        width: 10px;
        height: 10px;
      }
    }
  }

  + ${FakeInput} {
    transition: background var(--animation-speed) ease-in-out;
    &:before,
    .icon-check {
      position: absolute;
      top: 50%;
      left: 50%;
      opacity: 0;
      transform: translate(-50%, -50%);
      transition: opacity var(--animation-speed) ease-in-out;
    }
  }

  &[type='checkbox'] {
    + ${FakeInput} {
      .icon-check {
        color: var(--white);
        font-size: var(--font-size-xs);
      }
    }
  }

  &[type='checkbox'],
  &[type='radio'] {
    display: none;
    &:checked {
      + ${FakeInput} {
        background: var(--primary);
        .icon-check,
        &:before {
          opacity: 1;
        }
      }
    }
    &:disabled {
      + ${FakeInput} {
        opacity: 0.5;
      }
    }
  }
`;

export const StyledTextarea = styled.textarea`
  ${styles}
  resize: vertical;
  min-height: 9.375rem;
`;

export const StyledInput = styled.input`
  ${styles}
`;
