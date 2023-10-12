import Button from 'components/atoms/Button';
import Loaders from 'components/atoms/Loaders';
import Switch from 'components/atoms/Switch';
import React, { useState, useContext, useEffect } from 'react';
import transactionService from 'services/transactionService';
import Field from 'components/molecules/Field';
import Form, { useForm } from 'components/molecules/Form';
import Toast from 'components/molecules/Toast';
import { AuthContext } from '../../../context/authContext';

export default function MakePayment({ customer, userInfo, onClose = () => {} }) {
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const { refetch } = useContext(AuthContext);
  const makePayment = async ({ ref_num, eduEmail }) => {
    try {
      setLoading(true);
      await transactionService.searchInteracPaymentByAdmin({
        ReferenceNumber: ref_num,
        customer: customer._id,
        eduEmail,
      });
      onClose();
      refetch();
      setLoading(false);
      Toast({
        message: 'Payment made successfully',
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

  useEffect(() => {
    form.setFieldsValue({ eduEmail: true });
  }, []);

  return (
    <Loaders loading={loading}>
      {userInfo}
      <Form form={form} onSubmit={makePayment}>
        <Form.Item
          sm
          name="ref_num"
          label="Interac Reference Number"
          rules={[{ pattern: /^.{0,8}$/, message: 'Maximum Character Length is 8' }]}>
          <Field />
        </Form.Item>
        <Form.Item label="Send Educational Email" name="eduEmail">
          <Switch />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </Loaders>
  );
}
