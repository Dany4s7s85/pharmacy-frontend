import styled, { css } from 'styled-components/macro';

const BtnStyles = css`
  position: absolute;
  top: 50%;

  color: var(--white);
  font-size: var(--font-size-xxl);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease-in-out;
  z-index: 2;
`;

export const Delete = styled.button`
  ${BtnStyles}
  transform: translateY(-50%);
  left: 70px;
`;

export const PreviewBtn = styled.button`
  ${BtnStyles}
  left: ${({ withDelete }) => (withDelete ? '60%' : '50%')};
  transform: ${({ withDelete }) => (withDelete ? 'translateY(-50%)' : 'translate(-50%,-50%)')};
`;

export const ImgHolder = styled.div`
  border: 1px solid var(--light-gray);
  padding: 10px;
  border-radius: 10px;
  height: 250px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  &:hover {
    &:after,
    ${Delete},${PreviewBtn} {
      opacity: 1;
      visibility: visible;
    }
  }
  &:after {
    transition: all 0.3s ease-in-out;
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.8);
    opacity: 0;
    visibility: hidden;
    z-index: 1;
  }
  img {
    border-radius: 10px;
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
`;
