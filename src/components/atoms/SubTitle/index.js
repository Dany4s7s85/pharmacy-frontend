import styled from 'styled-components/macro';

const SubTitle = styled.p`
  font-size: 1rem;
  line-height: 1.625rem;
  margin-bottom: 1.875rem;
  display: block;
  color: var(--text-color-gray);
  @media (min-width: 768px) {
    line-height: 1.5625rem;
    font-size: ${({ base }) => !base && 'var(--font-size-xl)'};
  }
`;

export default SubTitle;
