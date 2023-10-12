import React from 'react';

import { StyledParagraph } from './Paragraph.styles';

function Paragraph({ children, noMargin, xs, sm, lg, xl, ...props }) {
  return (
    <>
      <StyledParagraph noMargin={noMargin} xs={xs} sm={sm} lg={lg} xl={xl} {...props}>
        {children}
      </StyledParagraph>
    </>
  );
}

export default Paragraph;
