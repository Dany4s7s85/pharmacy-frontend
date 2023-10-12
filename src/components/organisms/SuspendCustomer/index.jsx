import React, { useState, useContext } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import Form, { useForm } from 'components/molecules/Form';
import Select from 'components/atoms/Select';
import Field from 'components/molecules/Field';
import Toast from 'components/molecules/Toast';
import Loaders from 'components/atoms/Loaders';
import userService from 'services/userService';
import { AuthContext } from 'context/authContext';
import Alert from 'components/molecules/Alert';
import Button from 'components/atoms/Button';

const SuspendCustomer = ({ customer, children, onClose }) => {
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const { refetch } = useContext(AuthContext);

  const suspendStatus = [
    { value: 'Suspended Due to Non-payment', label: 'Suspended Due to Non-payment' },
    { value: 'Suspended Due to Cancellation', label: 'Suspended Due to Cancellation' },
    { value: 'Suspended Due to Unverified Identity', label: 'Suspended Due to Unverified Identity' },
    { value: 'Suspended Due to Fraud', label: 'Suspended Due to Fraud' },
    {
      value: 'Suspended due to Consumer proposal or Bankruptcy',
      label: 'Suspended due to Consumer proposal or Bankruptcy',
    },
    { value: 'Suspended Sent to Collection', label: 'Suspended Sent to Collection' },
  ];

  const handleSubmit = async values => {
    setLoading(true);
    await userService
      .suspendCustomer({ user: customer._id, reason: values.reason.value, note: values.note })
      .then(res => {
        if (res.success) {
          refetch();
          onClose();
          Toast({
            message: 'Customer suspended successfully',
            type: 'success',
          });
        } else {
          Toast({
            type: 'error',
            message: res,
          });
        }
      });
    setLoading(false);
  };

  return (
    <Loaders loading={loading}>
      <Form form={form} onSubmit={handleSubmit}>
        {children}
        <Form.Item
          sm
          options={
            customer.status === 'Funds Requested'
              ? [
                  {
                    value: 'Suspended Due to Partial Payment',
                    label: 'Suspended Due to Partial Payment',
                  },
                  {
                    value: 'Suspended Due to Application Cancellation',
                    label: 'Suspended Due to Application Cancellation',
                  },
                  {
                    value: 'Suspended due to Application error',
                    label: 'Suspended due to Application error',
                  },
                ]
              : customer.status === 'Funds Received'
              ? [
                  ...suspendStatus,
                  {
                    value: 'Suspended due to Application error',
                    label: 'Suspended due to Application error',
                  },
                ]
              : suspendStatus
          }
          label="Reason"
          name="reason"
          placeholder="Select a Reason"
          rules={[
            {
              required: true,
              message: 'Please select a reason for Suspension',
            },
          ]}>
          <Select />
        </Form.Item>
        <Form.Item
          label="Note"
          name="note"
          type="textarea"
          placeholder="Enter Note Here"
          rules={[
            {
              required: true,
              message: 'Value Is Required',
            },
            {
              pattern: /^[a-zA-Z0-9./$!& ()><@#*^%?,']{10,200}$/,
              message: 'Note must be minimum 10 and maximum 200 characters',
            },
          ]}>
          <Field />
        </Form.Item>
        <Alert
          type="warning"
          message="Are you sure you want to Suspend the customer? If so, please select a reason for Suspension and hit the submit button."
          css="margin-bottom:15px;"
        />
        <Button type="danger" htmlType="submit">
          Submit
        </Button>
      </Form>
    </Loaders>
  );
};

export default SuspendCustomer;
