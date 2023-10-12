import styled from 'styled-components/macro';

export const QrInstructions = styled.div`
  .title {
    display: block;
    margin-bottom: 15px;
  }
`;
export const QrHolder = styled.div`
  max-width: 350px;
  margin: 0 auto;
  border: 1px solid #ccc;
  margin-bottom: 20px;
  border-radius: 5px;
  overflow: hidden;
  img {
    width: 100%;
  }
`;
export const List = styled.ol`
  padding: 0;
  margin: 0;
  counter-reset: list;
  list-style-type: none;
`;
export const ListItem = styled.li`
  counter-increment: list;
  position: relative;
  padding-left: 40px;
  margin-bottom: 15px;
  &:before {
    content: counter(list);
    background: var(--primary);
    position: absolute;
    top: 0;
    left: 0;
    width: 30px;
    height: 30px;
    border-radius: 100%;
    color: var(--white);
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
