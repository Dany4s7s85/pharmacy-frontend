import styled from 'styled-components/macro';

export const StyledTableLayout = styled.div`
  margin: ${({ noNegativeMargin }) => (noNegativeMargin ? '' : '0 -20px 0')};
  border-top: 1px solid var(--table-border);
`;
