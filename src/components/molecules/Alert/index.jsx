import React from 'react';

import AlertIcon from 'components/atoms/AlertIcon';
import { StyledAlert, Message } from './Alert.styles';

function Alert({ type, message, ...props }) {
  return (
    <>
      <StyledAlert $type={type} {...props}>
        <AlertIcon $type={type} />
        <Message $type={type}>{message}</Message>
      </StyledAlert>
    </>
  );
}

export default Alert;
