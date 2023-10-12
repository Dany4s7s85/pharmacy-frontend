import styled from 'styled-components/macro';

export const ProgressHolder = styled.div`
  display: flex;
  flex-direction: column;
  progress[value] {
    width: width;
    appearance: none;

    &::-webkit-progress-bar {
      background-color: #eee;
      height: 10px;
      border-radius: 20px;
    }
    &::-webkit-progress-value {
      height: 20px;
      border-radius: 20px;
      background-color: ${({ color }) => color};
    }
  }
`;
