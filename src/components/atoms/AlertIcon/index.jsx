import React from 'react';

import { StyledIcon } from './AlertIcon.styles';

function AlertIcon({ $type }) {
  const iconType = () => {
    switch ($type) {
      case 'error':
        return 'error_outline';
      case 'info-red':
        return 'info';
      case 'warning':
        return 'warning';
      case 'success':
        return 'check_circle_outline';
      default:
        return 'info';
    }
  };
  return (
    <>
      <StyledIcon $type={$type}>
        <span className="material-icons-outlined">{iconType()}</span>
      </StyledIcon>
    </>
  );
}

export default AlertIcon;
