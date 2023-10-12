import React, { useState, useContext } from 'react';
import Grid from 'components/atoms/Grid';
import Button from 'components/atoms/Button';
import Loaders from 'components/atoms/Loaders';
import { endOfDay, startOfDay } from 'date-fns';
import { getDateObject } from 'helpers/common';
import equifaxService from 'services/equifaxService';
import Toast from 'components/molecules/Toast';
import { AuthContext } from 'context/authContext';
import Label from 'components/atoms/Label';
import Field from 'components/molecules/Field';

const GenerateEquifaxTriggerFileForm = () => {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState({
    startDate: '',
    endDate: '',
    fileType: '',
  });
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const { refetch } = useContext(AuthContext);
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await equifaxService.generateAddDeleteFile(query);
      if (res) {
        if (res?.data?.success) {
          Toast({
            type: 'success',
            message: res?.data?.message,
          });
          refetch();
        } else {
          Toast({
            type: 'error',
            message: res?.data?.message,
          });
        }
      }
    } catch (ex) {
      Toast({
        type: 'error',
        message: ex?.message,
      });
    }
  };

  return (
    <Loaders loading={loading}>
      <Field
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={({ target: { value } }) => {
          setDateRange(value);
          if (value[0] && value[1]) {
            setQuery({
              ...query,
              startDate: value[0] ? startOfDay(getDateObject(value[0])).toISOString() : '',
              endDate: value[1] ? endOfDay(getDateObject(value[1])).toISOString() : '',
            });
          } else if (!value[0] && !value[1]) {
            setQuery({
              ...query,
              startDate: '',
              endDate: '',
            });
          }
        }}
        prefix={<i className="material-icons-outlined">date_range</i>}
        placeholderText="Select date range"
        type="datepicker"
        label="Date Range"
        sm
        clear={startDate || endDate}
      />

      <Label>Select File Type</Label>
      <Grid xs={1} sm={3} gap={0}>
        <Field
          type="radio"
          label="Test File"
          name="fileType"
          id="Test File"
          onChange={() => {
            setQuery({
              ...query,
              fileType: 1,
            });
          }}
        />
        <Field
          type="radio"
          label="Main File"
          name="fileType"
          id="Main File"
          onChange={() => {
            setQuery({
              ...query,
              fileType: 2,
            });
          }}
        />
      </Grid>

      <Button type="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </Loaders>
  );
};

export default GenerateEquifaxTriggerFileForm;
