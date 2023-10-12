import React from 'react';

import { StyledInputIcon } from './InputIcon.styles';

function InputIcon({ prefix, invalid, suffix, children, disabled, ...props }) {
  return (
    <>
      <StyledInputIcon $prefix={prefix} $invalid={invalid} $suffix={suffix} disabled={disabled} {...props}>
        {children}
      </StyledInputIcon>
    </>
  );
}

export default InputIcon;
