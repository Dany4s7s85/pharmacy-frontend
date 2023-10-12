import React from 'react';

import { StyledButton } from './InputButton.styles';

function InputButton({ children, ...props }) {
  return <StyledButton {...props}>{children}</StyledButton>;
}

export default InputButton;
