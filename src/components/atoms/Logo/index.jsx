import React from 'react';

import logo from 'assets/images/logo-black.svg';
import { LogoHolder, Img } from './Logo.styles';

function LogoComp() {
  return (
    <LogoHolder>
      <Img src={logo} alt="plastk" />
    </LogoHolder>
  );
}

export default LogoComp;
