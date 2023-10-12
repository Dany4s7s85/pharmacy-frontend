import styled from 'styled-components/macro';

export const StyledInputIcon = styled.span`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: ${({ $prefix }) => $prefix && '15px'};
  right: ${({ $suffix }) => $suffix && '15px'};
  color: ${({ $invalid }) => ($invalid ? 'var(--danger)' : 'var(--secondary-text-color)')};
  font-size: var(--font-size-lg);
  background: none;
  border: none;
  padding: 0;
  z-index: 1;
  ${({ disabled }) => disabled && 'opacity: 0.5'};
  i {
    display: block;
  }
`;
