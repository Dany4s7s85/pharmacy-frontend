import styled, { css } from 'styled-components/macro';

const HeadingColor = css`
  color: var(--headings-color);
  font-family: var(--headings-font-family);
  font-weight: 300;
`;

export const H1 = styled.h1`
  ${HeadingColor}
  font-size: var(--font-size-xxl);
  line-height: calc(var(--font-size-xxl) + 0.3125rem);
  margin-bottom: 0.625rem;
  @media (min-width: 768px) {
    font-size: var(--h1-font-size);
    line-height: calc(var(--h1-font-size) + 0.3125rem);
    margin-bottom: 1.25rem;
  }
`;

export const H2 = styled.h2`
  ${HeadingColor}
  font-size: var(--font-size-xl);
  line-height: calc(var(--font-size-xl) + 0.3125rem);
  font-weight: 500;
  @media (min-width: 768px) {
    font-size: var(--h2-font-size);
    line-height: calc(var(--h2-font-size) + 0.3125rem);
  }
`;

export const H3 = styled.h3`
  ${HeadingColor}
  font-size: var(--h3-font-size);
  line-height: calc(var(--h3-font-size) + 0.3125rem);
`;

export const H4 = styled.h4`
  ${HeadingColor}
  font-size: var(--h4-font-size);
  line-height: calc(var(--h4-font-size) + 0.3125rem);
  font-weight: 600;
`;

export const H5 = styled.h5`
  ${HeadingColor}
  font-size: var(--h5-font-size);
  line-height: calc(var(--h5-font-size) + 0.3125rem);
`;

export const H6 = styled.h6`
  ${HeadingColor}
  font-size: var(--h6-font-size);
  line-height: calc(var(--h6-font-size) + 0.3125rem);
`;
