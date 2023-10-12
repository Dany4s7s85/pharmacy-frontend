import React from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import ivrService from 'services/ivrService';
import InfoCard from 'components/molecules/InfoCard';
import Button from 'components/atoms/Button';
import Field from 'components/molecules/Field';
import Form, { useForm } from 'components/molecules/Form';
import Toast from 'components/molecules/Toast';

export default function UpdateAgentDetails({ onClose, sid, refetch }) {
  const [form] = useForm();
  const handleSubmit = async values => {
    try {
      await form.validateFields();
      const res = await ivrService.updateWorker(sid, values.contact_number);
      if (res) {
        Toast({
          type: 'success',
          message: 'Phone Number Updated Successfully',
        });
        refetch();
        onClose();
      }
    } catch (ex) {
      Toast({
        type: 'error',
        message: ex?.message,
      });
    }
  };
  return (
    <>
      <InfoCard title="Sid of Agent" value={sid} $unStyled css="margin-bottom: 20px;" />

      <Form form={form} onSubmit={handleSubmit}>
        <Form.Item
          sm
          type="number"
          rules={[{ changeRegex: 'phone_number' }]}
          label="Contact Number"
          name="Contact_Number">
          <Field />
        </Form.Item>
        <div
          css={`
            display: flex;
            justify-content: flex-end;
            gap: 20px;
          `}>
          <Button type="outline" onClick={onClose} width={120}>
            cancel
          </Button>
          <Button type="primary" width={120} htmlType="submit">
            Update
          </Button>
        </div>
      </Form>
    </>
  );
}
