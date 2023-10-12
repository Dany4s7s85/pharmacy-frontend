import React, { useState, useContext } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import Loaders from 'components/atoms/Loaders';
import Field from 'components/molecules/Field';
import { getDateObject } from 'helpers/common';
import { endOfDay, startOfDay } from 'date-fns';
import Switch from 'components/atoms/Switch';
import Button from 'components/atoms/Button';
import { AuthContext } from 'context/authContext';
import userService from 'services/userService';
import Toast from 'components/molecules/Toast';

const StudentPromotionSettings = ({ onClose }) => {
  const { env_setting, refetch } = useContext(AuthContext);
  const [envSettings, setEnvSettings] = useState(env_setting);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([
    new Date(envSettings.BTS_PROMOTION_START),
    new Date(envSettings.BTS_PROMOTION_END),
  ]);
  const [startDate, endDate] = dateRange;

  const handleSetEnvSettings = async () => {
    setLoading(true);
    await userService
      .setEnvSettings(envSettings)
      .then(res => {
        if (res.success) {
          setEnvSettings(res.setting ?? env_setting);
          Toast({
            type: 'success',
            message: res?.message,
          });
        }
      })
      .catch(reason => {
        Toast({
          type: 'error',
          message: reason?.message ?? 'Something Went Wrong',
        });
      });
    refetch();
    onClose();
    setLoading(false);
  };

  return (
    <Loaders loading={loading}>
      <Field
        selectsRange
        startDate={startDate ?? null}
        endDate={endDate ?? null}
        onChange={({ target: { value } }) => {
          setDateRange(value);
          if (value[0] && value[1]) {
            setEnvSettings({
              ...envSettings,
              BTS_PROMOTION_START: value[0] ? startOfDay(getDateObject(value[0])).toISOString() : '',
              BTS_PROMOTION_END: value[1] ? endOfDay(getDateObject(value[1])).toISOString() : '',
            });
          } else if (!value[0] && !value[1]) {
            setEnvSettings({
              ...envSettings,
              BTS_PROMOTION_START: '',
              BTS_PROMOTION_END: '',
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
      <Switch
        noMargin
        name="status"
        label="Status"
        value={envSettings.BTS_PROMOTION}
        onChange={({ target: { value } }) => {
          setEnvSettings({
            ...envSettings,
            BTS_PROMOTION: value,
          });
        }}
      />
      <Button type="primary" onClick={() => handleSetEnvSettings()} css="margin-top:20px">
        Save
      </Button>
    </Loaders>
  );
};

export default StudentPromotionSettings;
