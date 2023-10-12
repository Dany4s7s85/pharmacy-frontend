import React, { useState, useContext } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import Loaders from 'components/atoms/Loaders';
import Field from 'components/molecules/Field';
import Button from 'components/atoms/Button';
import { AuthContext } from 'context/authContext';
import userService from 'services/userService';
import Toast from 'components/molecules/Toast';

const ExtendSuspensionDate = ({ onClose }) => {
  const { env_setting, refetch } = useContext(AuthContext);
  const [envSettings, setEnvSettings] = useState(env_setting);
  const [loading, setLoading] = useState(false);

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
        value={envSettings?.SUSPENSION_DAY}
        onChange={({ target: { value } }) => {
          setEnvSettings({
            ...envSettings,
            SUSPENSION_DAY: value,
          });
        }}
        placeholderText="Select New Suspension Date"
        min="1"
        type="number"
        label="Suspension Day"
        sm
      />
      <Button type="primary" css="margin-top:20px" onClick={handleSetEnvSettings}>
        Save
      </Button>
    </Loaders>
  );
};

export default ExtendSuspensionDate;
