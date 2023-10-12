import React from 'react';
import Button from 'components/atoms/Button';

import Field from 'components/molecules/Field';
import Form, { useForm } from 'components/molecules/Form';

function AgentLogin() {
  const [form] = useForm();
  return (
    <Form form={form}>
      <Form.Item
        type="text"
        label="Agent Name"
        name="agent_name"
        placeholder="Enter Name"
        sm
        prefix={<i className="material-icons-outlined">support_agent</i>}
        rules={[{ required: true }, { email: true }]}>
        <Field />
      </Form.Item>
      <Button type="primary">LOGIN</Button>
    </Form>
  );
}

export default AgentLogin;
