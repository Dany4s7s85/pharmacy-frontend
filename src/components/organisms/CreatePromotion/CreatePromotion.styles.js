// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';

export const FieldHolder = styled.div`
  padding: 0 0 5px;
`;

export const TextWrap = styled.div`
  width: 100%;
  font-size: 14px;
  line-height: 20px;
  border: 1px solid #dadada;
  border-radius: 5px;
  margin: 20 0 20px;
  padding: 25px 30px;
  background: var(--white);
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const Holder = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin: 0 0 30px;
`;

export const LeftColumn = styled.div`
  width: 330px;
`;

export const ImgColumn = styled.div`
  width: 250px;
  height: 250px;
  padding: 15px;
  margin: 0 0 0 20px;
  border-radius: 5px;
  border: 1px solid var(--light);
  background: #ccc;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  span {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 250px;
  }
`;

export const ImgBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 250px;
  flex-shrink: 0;
  background: var(--white);
  border: 2px solid var(--light-secondary);
  border-radius: 5px;
  margin: 0 0 20px;

  img {
    display: block;
    max-width: 100%;
    height: auto;
  }
`;

export const RadioWrap = styled.div``;

export const BtnHolder = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const StyledList = styled.ol`
  display: flex;
  flex-flow: row wrap;
  margin-bottom: 40px;
  text-transform: capitalize;
  li {
    width: 33.3%;
    padding: 10px;
  }
`;

export const VisitsHolder = styled.div`
  padding: 20px 15px 0;
  border: 1px solid #dadada;
  border-radius: 6px;
`;
