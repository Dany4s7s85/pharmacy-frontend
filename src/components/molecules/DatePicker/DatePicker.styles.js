import styled from 'styled-components/macro';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { styles } from 'components/atoms/Input/Input.styles';

export const StyledDateRange = styled(DatePicker)`
  ${styles}
  padding-left: ${({ prefix }) => prefix && '2.5rem'};
  padding-right: 2rem;
`;

export const ButtonHolder = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
`;
