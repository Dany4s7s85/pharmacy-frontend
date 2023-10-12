import styled from 'styled-components/macro';

export const MessageHolder = styled.div`
  background: #eff2f8;
  border-radius: 10px;
  text-align: center;
  padding: 15px 10px;
  margin: 0 auto;
  font-weight: bold;
  max-width: ${({ $width }) => $width && `${$width}px`};
  color: var(--primary);
  p {
    color: inherit;
  }
`;
