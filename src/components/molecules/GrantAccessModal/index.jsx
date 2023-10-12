import React, { useState } from 'react';

import Button from 'components/atoms/Button';
import businessUsersService from 'services/businessUsersService';
import Form from '../Form/Form';
import Field from '../Field';
import Toast from '../Toast';

const GrantAccessModal = ({ id, onClose }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    setLoading(true);
    const payload = {
      time: 'minutes',
      duration: e?.duration,
    };
    await businessUsersService
      .createBusinessAssociates(id, payload)
      .then(res => {
        // redirect to bap
        Toast({
          type: 'success',
          message: res?.message,
        });
        setLoading(false);
        onClose();
        window.open(`${process.env.REACT_APP_BAP_MAIN_URL}/business-associate?token=${res?.token}`, '_blank');
      })
      .catch(err => {
        setLoading(false);
        Toast({
          type: 'error',
          message: err.message,
        });
      });
  };
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item
        name="duration"
        label="Duration (minutes)"
        placeholder="Enter Time"
        type="number"
        rules={[
          { required: true, message: 'Enter Time' },
          { min: 1, message: 'Time must be greator than 0' },
          { max: 60, message: 'Maximum Time can be 60 minutes' },
        ]}>
        <Field />
      </Form.Item>
      <Button loading={loading} type="primary" htmlType="submit">
        Gain Access
      </Button>
    </Form>
  );
};

export default GrantAccessModal;
