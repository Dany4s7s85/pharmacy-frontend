/* eslint-disable no-unused-vars */
import React, { useContext, useState } from 'react';
import Button from 'components/atoms/Button';
import Select from 'components/atoms/Select';
import Field from 'components/molecules/Field';
import Form, { useForm } from 'components/molecules/Form';
import Toast from 'components/molecules/Toast';
import { AuthContext } from 'context/authContext';
import businessUsersService from 'services/businessUsersService';

const ChangeBapClientType = ({ user, onClose }) => {
  const [form] = useForm();
  const { refetch } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({});
  const handleSubmit = val => {
    setLoading(true);
    businessUsersService
      .changeClentType(user?._id, { ...val, client_type: val.client_type.value })
      .then(res => {
        setLoading(false);
        if (res?.Error) {
          Toast({
            type: 'error',
            message: res?.message,
          });
        } else {
          onClose();
          Toast({
            type: 'success',
            message: res?.message,
          });
        }
      })
      .catch(err => {
        setLoading(false);
        Toast({
          type: 'error',
          message: err?.message,
        });
      });
    refetch();
  };

  const typeOptions = [
    { value: 'Credit', label: 'Credit Business Client' },
    { value: 'Prepaid', label: 'PrePaid Business Client' },
  ];

  return (
    <Form form={form} onSubmit={handleSubmit} onTouched={__ => setState(_ => ({ ..._, ...__ }))}>
      <Form.Item
        name="client_type"
        label="Client Type"
        options={
          user?.client_type === 'Prepaid'
            ? [{ value: 'Credit', label: 'Credit Business Client' }]
            : user?.client_type === 'Credit'
            ? [{ value: 'Prepaid', label: 'PrePaid Business Client' }]
            : typeOptions
        }
        placeholder="Select Client Type">
        <Select />
      </Form.Item>
      {state?.client_type?.value === 'Credit' && (
        <Form.Item
          name="credit_limit"
          label="Credit Limit"
          type="number"
          prefix="$"
          placeholder="Enter Credit Limit"
          rules={[
            { required: true, message: 'Please enter credit limit' },
            { min: 100, message: 'Credit limit must be greater than or equal to $100' },
            { pattern: /^\d+$/, message: 'Only Whole Numbers Are Allowed' },
          ]}>
          <Field />
        </Form.Item>
      )}

      <Button htmlType="submit" type="primary" loading={loading}>
        Submit
      </Button>
    </Form>
  );
};

export default ChangeBapClientType;
