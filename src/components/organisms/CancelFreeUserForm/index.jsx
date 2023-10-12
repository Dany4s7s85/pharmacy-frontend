import React, { useContext, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import Loaders from 'components/atoms/Loaders';
// import Field from 'components/molecules/Field';
import Form, { useForm } from 'components/molecules/Form';
import Toast from 'components/molecules/Toast';
import Button from '../../atoms/Button';
import Select from '../../atoms/Select';
import freeUserService from '../../../services/freeUserService';
import { AuthContext } from '../../../context/authContext';

export default function KycRejectionForm({ onClose, userId }) {
  const [form] = useForm();

  const [loading, setLoading] = useState(false);
  const { refetch } = useContext(AuthContext);

  const cancellationReason = [
    { value: 'Bad service provider', label: 'Bad service provider' },
    { value: "I don't like this", label: "I don't like this" },
    { value: 'Will come again in future', label: 'Will come again in future' },
    { value: 'Wanted an unsecured card', label: 'Wanted an unsecured card' },
    { value: 'Closed by customer request', label: 'Closed by customer request' },
  ];

  const onSubmit = async data => {
    const reason = data?.reason?.value;
    try {
      setLoading(true);
      const res = await freeUserService.cancelFreeUserApplication(userId, reason);
      if (res?.success) {
        Toast({
          message: res?.message,
          type: 'success',
        });
      } else {
        Toast({
          message: res?.message,
          type: 'error',
        });
      }
      refetch();
      setLoading(false);
      onClose();
    } catch (ex) {
      Toast({
        type: 'error',
        message: ex?.message,
      });
    }
  };
  return (
    <>
      <Loaders loading={loading}>
        <Form form={form} onSubmit={onSubmit}>
          <Form.Item
            sm
            options={cancellationReason}
            type="text"
            label="Cancellation Reason"
            name="reason"
            placeholder="reason"
            hideSelectedOptions={false}
            isMulti={false}
            rules={[{ required: true, message: 'Please select cancellation  reason' }]}>
            <Select />
          </Form.Item>

          <Button loading={loading} type="danger" htmlType="submit">
            Save
          </Button>
        </Form>
      </Loaders>
    </>
  );
}
