import styled from 'styled-components/macro';
import Button from 'components/atoms/Button';

export const PaginationList = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background: var(--white);
  padding: 0.9375rem 1.25rem;
  box-shadow: 0px 23px 44px rgba(176, 183, 195, 0.14);
`;

export const PaginationButton = styled(Button)`
  font-size: var(--font-size-xs);
  line-height: 1;
  border: none;
  position: relative;
  display: flex;
  align-items: center;
  font-weight: bold;
  i {
    color: var(--primary);
    font-size: var(--font-size-xxl);
    line-height: 1;
  }
`;
