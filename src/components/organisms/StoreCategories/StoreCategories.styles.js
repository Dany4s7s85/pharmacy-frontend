// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import StoreColumn from '../StoreColumn';
import Grid from '../../atoms/Grid';

export const StoreCategory = styled.div`
  position: relative;
  width: 100%;
`;
export const Heading = styled.strong`
  display: block;
  font-size: 13px;
  line-height: 15px;
  text-transform: capitalize;
  font-weight: 700;
  margin-bottom: 10px;
  color: var(--secondary-text-color);
`;

export const StyledGrid = styled(Grid)`
  white-space: nowrap;
  overflow-x: auto;
  margin: 0 0 10px;
  padding: 0 0 10px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const StyledStoreColumn = styled(StoreColumn)`
  /* width: 100%;
  flex-grow: 1; */
`;
export const NoRecordMsg = styled.div`
  background: var(--primary);
  color: var(--white);
  font-size: var(--font-size-sm);
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-radius: 10px;
`;

export const Icon = styled.span`
  display: block;
  font-size: var(--font-size-lg);
  line-height: 1;
  margin-right: 15px;
  color: var(--primary);
`;
