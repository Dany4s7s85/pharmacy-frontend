import styled from 'styled-components/macro';

export const ImgBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;
  height: 100px;
  flex-shrink: 0;
  background: var(--white);
  border: 2px solid var(--light-secondary);
  border-radius: 5px;
  margin: 21px 0 20px;
  overflow: hidden;
  position: relative;

  img {
    display: block;
    max-width: 110px;
    width: 100%;
    object-fit: contain;
    height: 100%;
  }
  span {
    display: block;
    font-size: var(--font-size-xs);
    line-height: 15px;
    margin-top: 23px;
    color: var(--text-color-gray);
  }
`;
