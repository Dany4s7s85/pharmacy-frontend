import React, { useState, useContext } from 'react';
import Button from 'components/atoms/Button';
import Form, { useForm } from 'components/molecules/Form';
import Field from 'components/molecules/Field';
import Grid from 'components/atoms/Grid';
import userService from 'services/userService';
import Toast from 'components/molecules/Toast';
import Loaders from 'components/atoms/Loaders';
import { AuthContext } from 'context/authContext';

const VerifyStudentEmail = ({ userId, onClose }) => {
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const { refetch } = useContext(AuthContext);

  const handleSubmit = async values => {
    setLoading(true);
    await userService
      .verifySchoolBTSCode({ code: values.code, user_id: userId })
      .then(res => {
        Toast({
          type: 'success',
          message: res.message,
        });
        onClose();
        refetch();
      })
      .catch(reason => {
        Toast({
          type: 'error',
          message: reason.message ?? 'Something Went Wrong',
        });
      });
    setLoading(false);
  };

  const getVerificationCode = async () => {
    setLoading(true);
    await userService
      .getSchoolEmailVerificationCode({
        user_id: userId,
        resendApprovalEmail: true,
      })
      .then(res => {
        Toast({
          type: 'success',
          message: res?.message,
        });
      })
      .catch(reason => {
        Toast({
          type: 'error',
          message: reason?.message ?? 'Something Went Wrong',
        });
      });
    setLoading(false);
  };

  return (
    <Loaders loading={loading}>
      <Form form={form} onSubmit={handleSubmit}>
        <Form.Item
          name="code"
          placeholder="Enter Verification Code"
          rules={[{ required: true, pattern: /^[0-9]*$/, message: 'Please input correct code!' }]}>
          <Field />
        </Form.Item>
        <Grid xs={1} sm={2} gap={30}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button type="outline" onClick={getVerificationCode}>
            Resend Verification Code
          </Button>
        </Grid>
      </Form>
    </Loaders>
  );
};

export default VerifyStudentEmail;
