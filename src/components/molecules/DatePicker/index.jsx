/* eslint-disable jsx-a11y/no-onchange */
import React from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';

import DatePickerHeader from '../DatePickerHeader';
import { StyledDateRange } from './DatePicker.styles';

function ReactDateRange({ prefix, disabled, excludeDateIntervals, invalid, error, onChange, ...props }) {
  return (
    <StyledDateRange
      disabled={disabled}
      excludeDateIntervals={excludeDateIntervals}
      prefix={prefix}
      invalid={invalid || error}
      renderCustomHeader={({
        date,
        changeYear,
        changeMonth,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
      }) => (
        <DatePickerHeader
          date={date}
          changeYear={changeYear}
          changeMonth={changeMonth}
          decreaseMonth={decreaseMonth}
          increaseMonth={increaseMonth}
          prevMonthButtonDisabled={prevMonthButtonDisabled}
          nextMonthButtonDisabled={nextMonthButtonDisabled}
        />
      )}
      {...props}
      onChange={_ => {
        onChange({ target: { value: _, name: props.name } });
      }}
    />
  );
}

export default ReactDateRange;
