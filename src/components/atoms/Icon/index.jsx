import React from 'react';

// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';

import { I } from './Icon.styles';
import Tooltip from '../Tooltip';

export default function Icon(props) {
  const { css } = props;
  if (props.showTooltip) {
    return (
      <Tooltip width={props.tooltipWidth} title={props.toolTipContent} css={css}>
        <I className="material-icons-outlined" {...props}>
          {props.iconName}
        </I>
      </Tooltip>
    );
  }
  return (
    <I className="material-icons-outlined" {...props}>
      {props.iconName}
    </I>
  );
}
