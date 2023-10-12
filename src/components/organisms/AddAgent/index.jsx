import React from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import ivrService from 'services/ivrService';
import GridCol from 'components/atoms/GridCol';
import Grid from 'components/atoms/Grid';
import Button from 'components/atoms/Button';
import Field from 'components/molecules/Field';
import Form, { useForm } from 'components/molecules/Form';
import Toast from 'components/molecules/Toast';

export default function AddAgent({ onClose, refetch }) {
  const [form] = useForm();

  const createWorkerFunction = async values => {
    try {
      await form.validateFields();
      const res = await ivrService.createWorker(values.name, values.contact_number);
      if (res) {
        Toast({
          type: 'success',
          message: 'Worker Created Successfully',
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
      <Form form={form} onSubmit={createWorkerFunction}>
        <Grid
          xs={1}
          lg={2}
          colGap={20}
          rowGap={20}
          css={`
            align-items: center;
          `}>
          <GridCol>
            <Form.Item
              sm
              type="text"
              rules={[
                { required: true, message: 'Please enter name of the worker' },
                { pattern: /^.{0,20}$/, message: 'Maximum Character Length is 20' },
              ]}
              label="Name"
              name="name"
              noMargin>
              <Field />
            </Form.Item>
          </GridCol>
          <GridCol>
            <Form.Item
              sm
              type="number"
              rules={[
                { changeRegex: 'phone_number' },
                { required: true, message: 'Please enter your contact number' },
                { pattern: /^.{0,20}$/, message: 'Maximum Character Length is 20' },
              ]}
              label="Contact Number"
              name="contact_number"
              noMargin>
              <Field />
            </Form.Item>
          </GridCol>
          <GridCol lg={2}>
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
          </GridCol>
        </Grid>
      </Form>
    </>
  );
}
