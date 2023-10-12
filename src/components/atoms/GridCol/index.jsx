import React from 'react';

import { StyledGridCol } from './GridCol.styles';

const GridCol = ({ children, xs, sm, md, lg, xl, order, ...props }) => (
  <StyledGridCol xs={xs} sm={sm} md={md} lg={lg} xl={xl} $order={order} {...props}>
    {children}
  </StyledGridCol>
);

export default GridCol;
