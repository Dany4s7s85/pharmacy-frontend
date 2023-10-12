import styled from 'styled-components/macro';

const getColor = iconName => {
  switch (iconName) {
    case 'settings':
      return 'light-blue';
    case 'check_circle':
      return 'success';
    case 'cancel':
      return 'danger';
    case 'sync':
      return 'light-blue';
    case 'error':
    case 'do_not_disturb':
    case 'watch_later':
      return 'warning';
    default:
      return 'black';
  }
};
export const I = styled.span`
  font-size: ${props => (props.size ? props.size : '20px')} !important;
  color: ${({ iconName }) => `var(--${getColor(iconName)})`};
  line-height: 1;
  cursor: pointer;
`;

export const IconHolder = styled.div``;
