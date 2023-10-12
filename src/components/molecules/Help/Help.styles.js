import styled from 'styled-components/macro';
import Paragraph from 'components/atoms/Paragraph';

export const HelpIcon = styled.div`
  font-size: 50px;
  line-height: 1;
  background: var(--primary);
  color: var(--white);
  width: 70px;
  height: 70px;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
`;

export const TextHolder = styled(Paragraph)`
  margin-bottom: 0;
  padding-top: 25px;
  color: #d9d9d9;
`;
