import styled, { css } from 'styled-components/macro';

export const TableHolder = styled.div`
  padding: ${({ noPadding }) => (noPadding ? '0' : '1.25rem 1.25rem 0.5625rem')};
  background: var(--base-background-color);
  padding-top: 10px;

  ${({ responsive }) =>
    responsive
      ? css`
          @media (min-width: 768px) {
            padding: 1.25rem;
          }
          @media (min-width: 992px) {
            background: var(--white);
            padding: 0;
          }
        `
      : css`
          background: var(--white);
        `}
`;

export const TableScroll = styled.div`
  width: 100%;
  overflow-x: auto;
  max-height: ${({ $height }) => $height && `${$height}px`};
`;

export const StyledTable = styled.table`
  border-collapse: collapse;
  width: 100%;
  color: var(--primary-text-color);
  ${({ responsive }) =>
    responsive
      ? css`
          @media (min-width: 992px) {
            min-width: ${({ $width }) => $width && `${$width}px`}; /* width on which horizontal scroll will appear */
          }
        `
      : css`
          min-width: ${({ $width }) => $width && `${$width}px`};
        `}
`;

export const Thead = styled.thead`
  ${({ responsive }) =>
    responsive
      ? css`
          @media (max-width: 991px) {
            display: none;
          }
        `
      : css`
          display: table-header-group;
        `}
`;

export const TBody = styled.tbody`
  ${({ responsive }) =>
    responsive &&
    css`
      @media (max-width: 991px) {
        display: grid;
        grid-template-columns: repeat(2, minmax(0px, 1fr));
        gap: 10px;
      }

      @media (max-width: 767px) {
        grid-template-columns: repeat(1, minmax(0px, 1fr));
      }
    `}
`;

export const NoRecordFound = styled.span`
  display: block;
  max-width: 200px;
  padding: 15px 10px 13px;
  margin: 15px auto;
  border-radius: 5px;
  color: var(--danger);
  background: #ffebeb;
  text-align: center;
`;
