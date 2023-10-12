import Button from 'components/atoms/Button';
import Loaders from 'components/atoms/Loaders';
import React, { useState, useContext } from 'react';
import { AuthContext } from 'context/authContext';
import cardService from 'services/cardService';
import Field from '../../molecules/Field';
import Form, { useForm } from '../../molecules/Form';
import Toast from '../../molecules/Toast';

export default function ActivateCard({ customer, onClose }) {
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const { refetch } = useContext(AuthContext);
  const activateCard = async digits => {
    try {
      await cardService.activateCardAdmin(customer.email, digits.code).then(res => {
        if (res.success) {
          setLoading(true);
          // do something here
          setLoading(false);
          onClose();
          refetch();
          Toast({
            message: 'Card Activated Successfully',
            type: 'success',
          });
        } else {
          onClose();
          refetch();
          Toast({
            message: res.message,
            type: 'error',
          });
        }
      });
    } catch (ex) {
      setLoading(false);
      onClose();
      refetch();
      Toast({
        type: 'error',
        message: ex?.message,
      });
    }
  };

  return (
    <Loaders loading={loading}>
      <Form form={form} css="margin-bottom: var(--gutter);" onSubmit={activateCard}>
        <Form.Item
          type="number"
          label="Enter last 4 digits of card"
          name="code"
          sm
          placeholder="Enter last 4 digits of card"
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
    </Loaders>
  );
}
