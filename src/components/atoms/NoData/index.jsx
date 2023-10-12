import React from 'react';
import { StyledNoData } from './NoData.styles';

function NoData({ text = 'No Data', ...props }) {
  return (
    <>
      <StyledNoData {...props}>{text}</StyledNoData>
    </>
  );
}

export default NoData;
