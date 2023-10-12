import React from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { Error } from 'components/molecules/Field/Field.styles';
import { StyledFormGroup } from 'styles/helpers.styles';
import Label from '../Label';

function RcSlider({ name, onChange, error, label, noMargin, rules, ...props }) {
  return (
    <StyledFormGroup $invalid={error} noMargin={noMargin}>
      <Label required={rules?.find(({ required }) => required === true)}>{label}</Label>
      <div
        css={`
          padding-left: 10px;
          padding-right: 10px;
          padding-bottom: 17px;
        `}>
        <Slider {...props} name={name} onChange={_ => onChange({ target: { value: _, name } })} />
      </div>
      {error && <Error>{error}</Error>}
    </StyledFormGroup>
  );
}

export default RcSlider;
