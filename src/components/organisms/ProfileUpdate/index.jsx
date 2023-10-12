import React, { useContext, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import { AuthContext } from 'context/authContext';
import adminService from 'services/adminService';
import Paragraph from 'components/atoms/Paragraph';
import Grid from 'components/atoms/Grid';
import GridCol from 'components/atoms/GridCol';
import Field from '../../molecules/Field';
import Button from '../../atoms/Button';
import Heading from '../../atoms/Heading';
import { ProfileBlock, Holder, BtnHolder, Head, FormHolder, ResetOtpHolder, Banner } from './ProfileUpdate.styles';
import Form, { useForm } from '../../molecules/Form';

import ConfirmationModal from '../../molecules/ConfirmationModal';
import Toast from '../../molecules/Toast';
import DataTabs from '../../molecules/DataTabs';
import QrModal from '../../molecules/QrModal';
import Modal from '../../molecules/Modal';

function ProfileUpdate() {
  const { user, loading, setLoading, onLogout } = useContext(AuthContext);
  const [imageSrc, setImageSrc] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const [form] = useForm();
  const resetOtp = async () => {
    try {
      setLoading(true);
      const res = await adminService.reset_auth({ generateNew: true, id: user._id });
      if (res) {
        const { qrcode } = res;
        Toast({
          type: 'success',
          message: 'Kindly Scan the QR code on screen to finish setting up your new otp',
        });
        setLoading(false);
        setImageSrc(qrcode);
        setIsOpen(true);
      }
    } catch (ex) {
      setLoading(false);
      Toast({
        type: 'error',
        message: ex.message,
      });
    }
  };
  const resetPassword = async e => {
    try {
      setLoading(true);
      const res = await adminService.resetPassword(e);
      if (res) {
        setLoading(false);
        Toast({
          type: 'success',
          message: 'Password reset successfully. Kindly re-login to verify',
        });
        onLogout();
      }
    } catch (ex) {
      setLoading(false);
      Toast({
        type: 'error',
        message: ex?.message,
      });
    }
  };

  const data = [
    {
      label: 'My Details',
      content: (
        <ProfileBlock>
          <Holder>
            <Head>
              <Heading
                level={3}
                css={`
                  margin: 0;
                  font-weight: 500;
                `}>
                My Details
              </Heading>
            </Head>
            <Form form={form} onSubmit={resetPassword}>
              <FormHolder>
                <Grid sm={12} colGap={20}>
                  <GridCol sm={6}>
                    <Field type="text" label="Username" placeholder="Email" disabled value={user.username} />
                  </GridCol>
                  <GridCol sm={6}>
                    <Field type="email" label="Email" placeholder="Email" disabled value={user.email} />
                  </GridCol>
                  <GridCol sm={12}>
                    <Form.Item
                      type="password"
                      name="currentPassword"
                      label="Current Password"
                      placeholder="Enter Current Password"
                      rules={[
                        {
                          required: true,
                          message: 'Please input your current password!',
                        },
                      ]}>
                      <Field />
                    </Form.Item>
                  </GridCol>
                  <GridCol sm={6}>
                    <Form.Item
                      name="password"
                      type="password"
                      label="New Password"
                      placeholder="Enter New Password"
                      rules={[
                        {
                          required: true,
                          message: 'Please input your new password!',
                        },
                        { password: true },
                      ]}>
                      <Field />
                    </Form.Item>
                  </GridCol>
                  <GridCol sm={6}>
                    <Form.Item
                      type="password"
                      name="confirmPassword"
                      label="Confirm New Password"
                      placeholder="Confirm New Password"
                      rules={[
                        {
                          required: true,
                          message: 'Please confirm your new password!',
                        },
                        {
                          transform: value => {
                            if (value !== form.getFieldValue('password')) {
                              return true;
                            }
                            return false;
                          },
                          message: 'Passwords do not match!',
                        },
                      ]}>
                      <Field />
                    </Form.Item>
                  </GridCol>
                </Grid>
              </FormHolder>
              <ResetOtpHolder>
                <Heading level={4}>Reset Otp</Heading>
                <Paragraph>
                  If you have lost your account of google or microsoft authenticator you can easily reset your
                  authenticator with a click.
                </Paragraph>
                {!imageSrc ? (
                  <ConfirmationModal
                    title="Reset Otp"
                    okLoading={loading}
                    subtitle="Are you sure you want to reset your otp token ?"
                    onOk={resetOtp}
                    confirmationModal="Confirm"
                    btnComponent={({ onClick }) => (
                      <Button type="outline" width={150} onClick={onClick}>
                        Reset OTP
                      </Button>
                    )}
                  />
                ) : (
                  <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
                    <QrModal qrImg={imageSrc} />
                  </Modal>
                )}
              </ResetOtpHolder>
              <BtnHolder>
                <Button loading={loading} rounded type="danger" width="150" htmlType="submit">
                  Update Password
                </Button>
              </BtnHolder>
            </Form>
          </Holder>
        </ProfileBlock>
      ),
    },
    {
      label: 'Chat',
      content: (
        <span
          css={`
            display: block;
            text-align: center;
            font-size: var(--font-size-xxl);
            background: var(--white);
            padding: 20px;
            border-radius: 10px;
            max-width: 300px;
            margin: 0 auto;
          `}>
          Coming Soon
        </span>
      ),
    },
  ];
  return (
    <>
      <Banner>
        <Heading level={2}>Profile</Heading>
      </Banner>
      <DataTabs data={data} white />
    </>
  );
}

export default ProfileUpdate;
