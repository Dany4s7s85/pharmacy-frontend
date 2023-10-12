/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components/macro';
import Form, { useForm } from 'components/molecules/Form';
import Select from 'components/atoms/Select';
import userService from 'services/userService';
import Toast from 'components/molecules/Toast';
import Button from 'components/atoms/Button';
import Field from 'components/molecules/Field';
import Upload from 'components/molecules/Upload';
import Grid from 'components/atoms/Grid';
import Alert from 'components/molecules/Alert';
import { AuthContext } from 'context/authContext';
import VerificationModal from './verificationModal';

const StudentPromotion = ({ onClose }) => {
  const [form] = useForm();
  const { env_setting, refetch } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [isVerificationModalVisible, setIsVerificationModalVisible] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  useEffect(() => () => refetch(), []);

  const handleUserSearch = async inputValue => {
    try {
      const response = await userService.getStudentCustomers(inputValue, env_setting);
      const options = response?.data?.map(_ => ({
        value: _._id,
        label: `Name:${`${_?.first_name} ${_?.last_name}`}, Email: ${_?.email}`,
      }));
      return options;
    } catch (ex) {
      Toast({
        type: 'error',
        message: ex.message,
      });
      return [];
    }
  };

  const handleSubmit = async values => {
    setLoading(true);
    await userService
      .getSchoolEmailVerificationCode({
        school_email_address: values.email,
        image_url: values.image,
        user_id: values.user_id.value,
        selfie: values.selfie,
        school_name: values.name,
        api_key: env_setting.API_KEY,
      })
      .then(res => {
        setIsVerificationModalVisible(true);
        Toast({
          type: 'success',
          message: res?.message,
        });
      })
      .catch(reason => {
        setShowVerificationModal(true);
        Toast({
          type: 'error',
          message: reason?.message ?? 'Something Went Wrong',
        });
      });
    setLoading(false);
  };

  return (
    <>
      <Form autoComplete="off" form={form} onSubmit={handleSubmit}>
        <Form.Item
          autoComplete="off"
          name="user_id"
          label="Select Customer"
          rules={[
            {
              required: true,
              message: 'Please Select Customer',
            },
          ]}>
          <Select autoComplete="off" sm open async defaultOptions filterOption={false} loadOptions={handleUserSearch} />
        </Form.Item>
        <Form.Item
          autoComplete="off"
          name="email"
          label="School Email"
          rules={[
            { required: true, message: 'Please Enter Email' },
            {
              pattern:
                /^[^<>()[\]\\,;:\%#^\s@\"$&!@]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: 'Enter Valid Email Address',
            },
          ]}
          placeholder="Enter Email">
          <Field sm autoComplete="off" />
        </Form.Item>
        <Form.Item
          autoComplete="off"
          name="name"
          label="School Name"
          rules={[
            {
              required: true,
              message: 'Please enter school name',
            },
            {
              pattern: /^[a-zA-Z0-9,!-.'+@#$^&/:|{}_";*()_ ]{3,}$/,
              message: 'School Name must be minimum 3 characters.',
            },
            {
              pattern: /^[a-zA-Z0-9,!-.'+@#$^&/:|{}_";*()_ ]{3,80}$/,
              message: 'School Name must be maximum 80 characters.',
            },
          ]}
          placeholder="Enter School Name">
          <Field sm autoComplete="off" />
        </Form.Item>
        <Grid xs={1} sm={2}>
          <Form.Item name="image" label="Student ID" rules={[{ required: true, message: 'Value Is Required' }]}>
            <Upload allowPreview base64 uploadBtnText="Upload Student ID" />
          </Form.Item>
          <Form.Item name="selfie" label="Selfie" rules={[{ required: true, message: 'Value Is Required' }]}>
            <Upload allowPreview base64 uploadBtnText="Upload Selfie" />
          </Form.Item>
        </Grid>
        <Alert
          css="margin: 15px 0px;"
          type="info"
          message="Note : Please keep in mind that you will be charged once and on the same or next day we will
                        reverse the transaction and notify you via email that your fee was refunded to your account."
        />
        <Grid xs={1} sm={showVerificationModal ? 2 : 1} gap={showVerificationModal ? 30 : 0}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit
          </Button>
          {showVerificationModal && (
            <Button type="outline" onClick={() => setIsVerificationModalVisible(true)}>
              Already Registered ? Enter Code
            </Button>
          )}
          <VerificationModal
            isVerificationModalVisible={isVerificationModalVisible}
            setIsVerificationModalVisible={setIsVerificationModalVisible}
            userId={form.getFieldValue('user_id')?.value}
            onClose={onClose}
          />
        </Grid>
      </Form>
    </>
  );
};

export default StudentPromotion;
