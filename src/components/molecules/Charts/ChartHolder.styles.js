import styled, { css } from 'styled-components/macro';

const Styles = css`
  border-radius: 7px;
  box-shadow: 0 4px 25px 0 rgb(168 180 208 / 10%);
  background: var(--white);
  padding: var(--gutter);
`;

export const BarChartHolder = styled.div`
  ${Styles}
  height: 300px;
`;
