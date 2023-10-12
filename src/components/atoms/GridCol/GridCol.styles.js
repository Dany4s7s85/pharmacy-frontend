import styled, { css } from 'styled-components/macro';

export const StyledGridCol = styled.div`
  ${({ xs }) =>
    xs &&
    css`
      grid-column: span ${xs} / span ${xs};
    `}

  ${({ sm }) =>
    sm &&
    css`
      @media (min-width: 576px) {
        grid-column: span ${sm} / span ${sm};
      }
    `}

  ${({ md }) =>
    md &&
    css`
      @media (min-width: 768px) {
        grid-column: span ${md} / span ${md};
      }
    `}

  ${({ lg }) =>
    lg &&
    css`
      @media (min-width: 992px) {
        grid-column: span ${lg} / span ${lg};
      }
    `}

  ${({ xl }) =>
    xl &&
    css`
      @media (min-width: 1200px) {
        grid-column: span ${xl} / span ${xl};
      }
    `}
    ${({ xxl }) =>
    xxl &&
    css`
      @media (min-width: 1500px) {
        grid-column: span ${xxl} / span ${xxl};
      }
    `}

    ${({ $order }) =>
    $order &&
    typeof $order === 'object' &&
    css`
      ${$order.xs &&
      css`
        order: ${$order.xs};
      `}

      ${$order.sm &&
      css`
        @media (min-width: 576px) {
          order: ${$order.sm};
        }
      `}

      ${$order.md &&
      css`
        @media (min-width: 768px) {
          order: ${$order.md};
        }
      `}

      ${$order.lg &&
      css`
        @media (min-width: 992px) {
          order: ${$order.lg};
        }
      `}

      ${$order.xl &&
      css`
        @media (min-width: 1200px) {
          order: ${$order.xl};
        }
      `}

      ${$order.xxl &&
      css`
        @media (min-width: 1500px) {
          order: ${$order.xxl};
        }
      `}
    `}

  ${({ $order }) =>
    $order &&
    typeof $order === 'number' &&
    css`
      order: ${$order};
    `}
`;
