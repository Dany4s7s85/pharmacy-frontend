import React from 'react';

import { StyledSwitch, SwitchLabel, SwitchHolder, LabelHolder } from './Switch.styles';

function Switch({ label, name, value, noMargin, ...props }) {
  const switchProps = {
    id: name,
    name,
    ...props,
  };
  return (
    <>
      <SwitchHolder noMargin={noMargin}>
        <StyledSwitch
          type="checkbox"
          {...switchProps}
          checked={value}
          value={value}
          onChange={({ target: { checked } }) => {
            props.onChange({
              target: { name, value: checked },
            });
          }}
        />
        <SwitchLabel htmlFor={switchProps.id}>
          {label && <LabelHolder>{label}</LabelHolder>}
          <span />
        </SwitchLabel>
      </SwitchHolder>
    </>
  );
}

export default Switch;
