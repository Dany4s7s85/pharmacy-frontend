import React, { useState, useContext } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import Button from 'components/atoms/Button';
import Loaders from 'components/atoms/Loaders';

import transactionService from 'services/transactionService';
import { AuthContext } from 'context/authContext';
import Alert from 'components/molecules/Alert';
import Field from 'components/molecules/Field';
import Form, { useForm } from 'components/molecules/Form';
import Toast from 'components/molecules/Toast';
import InteracHistory from '../InteracHistory';

export default function UpdateInteractCode({
  customer,
  onClose = () => {},
  setRefTrans = () => {},
  refTrans = false,
  firstTime,
  onClose1 = () => {},
}) {
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const { refetch } = useContext(AuthContext);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const updateInteractCode = async ({ code }) => {
    try {
      setLoading(true);
      const res = await transactionService.searchInteracAdmin(customer.email, code, true);

      if (res.remaining > 0) {
        if (firstTime) {
          setShowTransactionHistory(true);
        } else {
          onClose1();
          setRefTrans(!refTrans);
        }
      } else if (res.remaining === 0) {
        refetch();
        onClose();
        Toast({
          message: 'Moved to next status',
          type: 'success',
        });
      } else {
        Toast({
          message: res?.message,
          type: 'error',
        });
      }

      setLoading(false);
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
      {showTransactionHistory ? (
        <InteracHistory customer={customer} />
      ) : (
        <Form form={form} css="margin-bottom: var(--gutter);" onSubmit={updateInteractCode}>
          <Form.Item
            label="Enter Interac Reference Code"
            name="code"
            sm
            placeholder="Enter Interac Reference Code"
            rules={[
              {
                required: true,
              },
            ]}>
            <Field />
          </Form.Item>
          <Button type="primary" width={130} htmlType="submit">
            Submit
          </Button>
        </Form>
      )}

      <Alert
        css="margin-top: var(--gutter)"
        type="info"
        message="*The time between sending the deposit & updating the activation code needs to be about 30 minutes."
      />
    </Loaders>
  );
}
