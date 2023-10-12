import styled from 'styled-components/macro';

export const Error = styled.span`
  display: block;
  color: var(--danger);
  min-height: 26px;
  height: auto;
  opacity: 1;
  font-size: var(--font-size-xs);
  line-height: calc(var(--font-size-xs) + 0.25rem);
  padding-top: 3px;
  &:first-letter {
    text-transform: uppercase;
  }
`;

export const InputHolder = styled.div`
  @media (min-width: 576px) {
    position: relative;
  }
  @media (max-width: 575px) {
    position: ${({ $searchField }) => !$searchField && 'relative'};
  }
`;
