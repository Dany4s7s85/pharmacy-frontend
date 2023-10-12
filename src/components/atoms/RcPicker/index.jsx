/* eslint-disable no-shadow */
/* eslint-disable for-direction */
import React, { useEffect } from 'react';
import dateFnsGenerateConfig from 'rc-picker/lib/generate/dateFns';
import enUS from 'rc-picker/lib/locale/en_US';
import { addDays, addHours, addMonths, addYears, startOfHour } from 'date-fns';
import { StyledRangePicker } from './RcPicker.styles';
import { StyledFormGroup } from '../../../styles/helpers.styles';
import { Error } from '../../molecules/Field/Field.styles';
import Label from '../Label';
// import Toast from '../../molecules/Toast';

const RangePicker = ({
  label,
  name,
  type,
  onChange,
  value = {},
  error,
  form,
  rules,
  noMargin,
  labelIcon,
  extend,
  promotion,
}) => {
  const [_value, setValue] = React.useState([null, null]);
  const [startDate, setStartDate] = React.useState('');
  useEffect(() => {
    if (value === '') {
      setValue([]);
    } else if (
      value &&
      value.startDate &&
      value.endDate &&
      value.startDate !== _value[0] &&
      value.endDate !== _value[1]
    ) {
      setValue([new Date(value?.startDate), new Date(value?.endDate)]);
    }
  }, [value]);
  const rangePickerRef = React.useRef(null);
  const validateDate = dates => {
    let isValid = true;
    let message = '';
    if (dates[0].getTime() === dates[1].getTime()) {
      form.setFieldsError({ duration: { message: 'Start time and end time cannot be same' } });
      isValid = false;
      message = 'Start time and end time cannot be same';
    } else if (dates[0].getTime() > dates[1].getTime()) {
      isValid = false;
      message = 'Start time cannot be greater than end time';
      form.setFieldsError({ duration: { message: 'Start time cannot be greater than end time' } });
    } else if (
      dates[0].getTime() <= new Date().getTime() &&
      dates[0].getHours() < startOfHour(addHours(new Date(), 1)).getHours() &&
      !promotion
    ) {
      isValid = false;
      message = 'Start time should be 1 hour after current time';
    } else if (
      !extend &&
      !promotion &&
      dates[0].getTime() < startOfHour(addHours(new Date(), 1)).getTime() &&
      dates[1].getTime() < startOfHour(addHours(new Date(), 2)).getTime()
    ) {
      isValid = false;
      message = 'Start time should be 1 hour after current time and end time should be 2 hours after current time';
    } else if (type !== 'initialOffer' && dates[1].getTime() > addDays(new Date(dates[0]), 90).getTime()) {
      isValid = false;
      message = 'Promotion cannot be more than 90 days';
    } else if (type === 'initialOffer' && dates[1].getTime() > addMonths(new Date(dates[0]), 6).getTime()) {
      isValid = false;
      message = 'Promotion cannot be more than 6 months';
    } else if (type === 'initialOffer' && dates[1].getTime() < addMonths(new Date(dates[0]), 6).getTime()) {
      isValid = false;
      message = 'Promotion cannot less than 6 months';
    }

    return { isValid, message };
  };

  const props = {
    disabledDate: current => {
      if (extend) {
        return current && current.getTime() < new Date(value?.endDate).getTime();
      }

      return (
        current &&
        (current.getTime() <
          addHours(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()), 1).getTime() ||
          current.getTime() > addYears(new Date(), 1).getTime())
      );
    },
    disabled: [false, type === 'initialOffer'],
    disabledTime: (date, type) => ({
      disabledHours: () => {
        const hours = [];
        if (type === 'start' && date <= new Date().getTime()) {
          // eslint-disable-next-line no-plusplus
          for (let i = 0; i <= new Date().getHours(); i++) {
            hours.push(i);
          }
        } else if (type === 'end' && date <= new Date(startDate)) {
          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < new Date(startDate).getHours() + 1; i++) {
            hours.push(i);
          }
        }

        return hours;
      },
    }),
    placeholder: ['start date', 'end date'],
    allowEmpty: [false, type === 'initialOffer'],
    separator: '-',
    ref: rangePickerRef,
    locale: enUS,
    value: _value,
    generateConfig: dateFnsGenerateConfig,
    showTime: true,
    allowClear: true,
    use12Hours: true,
    showSecond: false,
    showMinute: false,
    format: 'YYYY-MM-DD hh:00 a',
    // format(getDateObject(new Date(item.duration.endDate).toString()), 'yyyy-MM-dd h:mm a')
    onChange: x => {
      if (!x) {
        setValue([]);
        onChange({
          target: {
            value: '',
            name,
          },
        });
      }
    },
    onOk: dates => {
      setStartDate(dates[0] ?? '');
      if (type === 'initialOffer' && dates[0]) {
        const myDates = [dates[0], addMonths(dates[0], 6)];
        const { isValid, message } = validateDate(myDates);
        setValue(myDates);
        onChange({
          target: {
            value: {
              startDate: startOfHour(new Date(myDates[0])),
              endDate: startOfHour(new Date(myDates[1])),
              message,
              isValid,
            },
            name,
          },
          message,
          isValid,
        });
      } else if (dates[0] && dates[1]) {
        const { isValid, message } = validateDate(dates);
        setValue(dates);
        onChange({
          target: {
            value: {
              startDate: startOfHour(new Date(dates[0])),
              endDate: startOfHour(new Date(dates[1])),
              message,
              isValid,
            },
            name,
          },
          message,
          isValid,
        });
      }
    },
    clearIcon: <span className="material-icons-outlined">close</span>,
  };

  return (
    <StyledFormGroup $invalid={error} noMargin={noMargin}>
      {label && (
        <Label required={rules?.filter(({ required }) => required).length} labelIcon={labelIcon}>
          {label}
        </Label>
      )}
      <StyledRangePicker $invalid={error} {...props} />
      {error && (
        <Error id={`${props.name}Error`} role="alert">
          {error}
        </Error>
      )}
    </StyledFormGroup>
  );
};
export default RangePicker;
