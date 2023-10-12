import styled from 'styled-components/macro';
import Grid from 'components/atoms/Grid';

export const PreviousDocsWrap = styled(Grid)`
  height: 280px;
  overflow-y: auto;
  border: 1px solid var(--light-gray);
  padding: 10px;
`;
export const OtherDocsWrap = styled(Grid)`
  height: 320px;
  overflow-y: auto;
  border: 1px solid var(--light-gray);
  padding: 10px;
`;

export const NoRecordFound = styled.span`
  max-height: 70px;
  display: block;
  max-width: 200px;
  padding: 15px 10px 13px;
  margin: 15px auto;
  border-radius: 5px;
  color: var(--danger);
  background: #ffebeb;
  text-align: center;
`;
