// TODO: fix calender positioning
import React from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';

import {
  StyledListboxInput,
  ReachListBoxButton,
  StyledListboxPopover,
  StyledListboxList,
  StyledListboxOption,
  Title,
} from './Dropdown.styles';

function Dropdown({ title, options, setValue, filter, children, twoBtns, type = 'light', size = 40 }) {
  return (
    <>
      {filter ? (
        <StyledListboxInput onChange={() => ''}>
          {({ isExpanded }) => (
            <>
              <ReachListBoxButton $type={type} $size={size} $shape="circle">
                {isExpanded ? (
                  <i className="material-icons-outlined">close</i>
                ) : (
                  <i className="material-icons-outlined">filter_alt</i>
                )}
              </ReachListBoxButton>
              <StyledListboxPopover $calendar portal={false} $twoBtns={twoBtns}>
                {title && <Title>{title}</Title>}
                {children}
                {/* was acting buggy so added hidden list to fix */}
                <StyledListboxList>
                  <StyledListboxOption value="1" css="display:none;">
                    hidden list
                  </StyledListboxOption>
                </StyledListboxList>
              </StyledListboxPopover>
            </>
          )}
        </StyledListboxInput>
      ) : (
        <StyledListboxInput onChange={value => setValue(value)}>
          <ReachListBoxButton $type={type} $size={size} $shape="circle">
            <i className="material-icons-outlined">more_vert</i>
          </ReachListBoxButton>
          <StyledListboxPopover portal={false} $twoBtns={twoBtns}>
            {title && <Title sm>{title}</Title>}
            <StyledListboxList>
              {Object.keys(options).map(option => (
                <StyledListboxOption key={option} value={options[option]} label={options[option]}>
                  {options[option]}
                </StyledListboxOption>
              ))}
            </StyledListboxList>
          </StyledListboxPopover>
        </StyledListboxInput>
      )}
    </>
  );
}

export default Dropdown;
