import styled from 'styled-components/macro';

export const HeadHolder = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px 15px;
`;

export const Arrows = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  line-height: 1;
  background: var(--white);
  border-radius: 10px;
  width: 25px;
  height: 25px;
  border: 1px solid var(--light);
  box-shadow: 0.2px 0.5px 0.5px rgba(0, 0, 0, 0.022), 0.6px 1.2px 1.3px rgba(0, 0, 0, 0.031),
    1.2px 2.5px 2.7px rgba(0, 0, 0, 0.039), 2.6px 5.1px 5.5px rgba(0, 0, 0, 0.048), 7px 14px 15px rgba(0, 0, 0, 0.07);
`;

export const Select = styled.select`
  border: none;
  background: none;
  outline: none;
  font-weight: bold;
  font-size: 16px;
  line-height: 1;
  text-align: center;
  option {
    font-size: 12px;
  }
`;

export const SelectHolder = styled.div`
  display: flex;
  align-items: center;
  select {
    margin: 0 10px;
  }
`;
