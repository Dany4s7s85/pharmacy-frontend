import styled from 'styled-components/macro';

export const CreditLimit = styled.span`
  text-align: center;

  display: block;
  span {
    font-size: var(--font-size-xxl);
    line-height: calc(var(--font-size-xxl) + 4px);
    color: var(--primary);
    display: block;
  }
`;

export const Customers = styled.span`
  color: var(--hit-gray);
`;

export const FlexHolder = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--gutter);
`;

export const Subtitle = styled.span``;
