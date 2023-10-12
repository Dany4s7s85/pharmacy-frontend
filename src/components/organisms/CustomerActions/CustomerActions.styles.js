import styled from 'styled-components/macro';

export const StepsList = styled.ul`
  position: relative;
  z-index: 0;
  counter-reset: step;
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 20px;
  padding-top: 15px;
  @media (min-width: 576px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;
export const StepItem = styled.li`
  counter-increment: step;
`;

export const StepBtn = styled.button`
  display: flex;
  align-items: center;
  background: var(--light-secondary);
  padding: 10px;
  width: 100%;
  border-radius: 10px;
  font-size: var(--font-size-sm);
  &:hover {
    background: var(--text-color-gray);
    color: var(--white);
  }
  &:before {
    content: counter(step) ' ';
    background: var(--primary);
    border-radius: 100%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--white);
    font-size: var(--font-size-xl);
    margin-right: 10px;
  }
`;

export const BtnWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin: 0 0 10px;
`;
