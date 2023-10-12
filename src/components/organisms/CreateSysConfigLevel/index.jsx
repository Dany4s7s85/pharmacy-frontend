import React from 'react';
import Button from 'components/atoms/Button';

import Form, { useForm } from 'components/molecules/Form';
import Field from 'components/molecules/Field';

function CreateSysConfigLevel() {
  const [form] = useForm();
  return (
    <>
      <Form form={form}>
        <Form.Item
          sm
          type="number"
          name="permission_level"
          label="Enter permission level"
          placeholder="Enter permission level"
          rules={[
            {
              required: true,
              message: 'This field is required and must be an integer greater than or equeal to 10!',
            },
            { pattern: /^\d+$/, message: 'Must be an integer' },
            { pattern: /^([1-9]\d|[1-9]\d{2,})$/, message: 'Must be greater than or equal to 10!' },
          ]}>
          <Field />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </>
  );
}

export default CreateSysConfigLevel;
