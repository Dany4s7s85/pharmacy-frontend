import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import Button from 'components/atoms/Button';
import Loaders from 'components/atoms/Loaders';
import transactionService from 'services/transactionService';
import Alert from 'components/molecules/Alert';
import Field from 'components/molecules/Field';
import Form, { useForm } from 'components/molecules/Form';
import Toast from 'components/molecules/Toast';

export default function CreateCreditLimitRequest({ customer, userInfo }) {
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const createCreditLimitRequest = async ({ code }) => {
    try {
      setLoading(true);
      await transactionService.createCreditLimitRequestByAdmin(code, customer._id);
      setLoading(false);
      Toast({
        message: 'Credit Limit Requested successfully',
        type: 'success',
      });
    } catch (ex) {
      setLoading(false);
      Toast({
        type: 'error',
        message: ex.message,
      });
    }
  };

  return (
    <Loaders loading={loading}>
      {userInfo}
      <Form form={form} css="margin-bottom: var(--gutter);" onSubmit={createCreditLimitRequest}>
        <Form.Item
          label="Enter Interac Reference Code"
          name="code"
          sm
          placeholder="Enter Interac Reference Code"
          rules={[
            {
              required: true,
            },
            { pattern: /^.{0,8}$/, message: 'Maximum Character Length is 8' },
          ]}>
          <Field />
        </Form.Item>
        <Button type="primary" width={130} htmlType="submit">
          Submit
        </Button>
      </Form>
      <Alert
        css="margin-top: 20px;"
        type="info"
        message="*The time between sending the deposit & updating the activation code needs to be about 30 minutes."
      />
    </Loaders>
  );
}
