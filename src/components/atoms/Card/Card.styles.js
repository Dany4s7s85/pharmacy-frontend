import styled from 'styled-components/macro';

export const StyledCard = styled.div`
  border-radius: 7px;
  box-shadow: 0 4px 25px 0 rgb(168 180 208 / 10%);
  background: var(--white);
  overflow: hidden;
`;

export const CardHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  padding: 10px 15px;
`;

export const CardContentHolder = styled.div`
  padding: ${({ noPadding }) => (noPadding ? '0' : '20px 15px')};
`;
