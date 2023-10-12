import styled, { css } from 'styled-components/macro';

export const PermissionListGroup = styled.div`
  border: 1px solid var(--light-gray);
  border-radius: 10px;
`;

export const PermissionListHead = styled.div`
  border-bottom: 2px solid var(--light-gray);
  padding: 10px 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${({ topHead }) =>
    topHead &&
    css`
      flex-direction: row-reverse;
      margin-bottom: 30px;
      border-radius: 5px;
      border: none;
      background: var(--light);
      box-shadow: 0px 8px 10px rgba(176, 183, 195, 0.14);
    `}
`;
