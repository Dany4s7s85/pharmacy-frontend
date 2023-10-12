import React, { useContext } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import { AuthContext } from 'context/authContext';

import Heading from 'components/atoms/Heading';
import Logo from 'components/atoms/Logo';

import Button from 'components/atoms/Button';
import Tooltip from 'components/atoms/Tooltip';
import QrModal from 'components/molecules/QrModal';
import LoginTemplate from '../../templates/LoginTemplate';
import Field from '../../molecules/Field';
import Form, { useForm } from '../../molecules/Form';

import { SubTitle, LoginHead, FormHolder, StyledForm, StyledLink } from './Login.styles';
import Modal from '../../molecules/Modal';

function Login() {
  const [form] = useForm();
  const { onLogin, user, user_loading, showTokenModal, setShowTokenModal } = useContext(AuthContext);
  return (
    <LoginTemplate>
      <LoginHead>
        <Logo />
        <StyledLink target="_blank" href={`${process.env.REACT_APP_MAIN_URL}`}>
          <i className="material-icons-outlined" css="margin-right: 5px;">
            arrow_back
          </i>
          Open the main site
        </StyledLink>
      </LoginHead>
      <FormHolder>
        <Heading level={1}>Sign in</Heading>
        <SubTitle>
          Hello there! Sign in and start managing <br /> user accounts.
        </SubTitle>
        <StyledForm form={form} onSubmit={onLogin}>
          <Form.Item
            type="text"
            label="Email / Username"
            name="email"
            placeholder="Your Email or Username"
            prefix={<i className="material-icons-outlined">email</i>}
            rules={[{ required: true }, { pattern: /^.{0,256}$/, message: 'Maximum Character Length is 256' }]}>
            <Field />
          </Form.Item>
          <Form.Item
            type="password"
            label="Password"
            name="password"
            placeholder="Your Password"
            prefix={<i className="material-icons-outlined">lock</i>}
            rules={[
              {
                required: true,
              },
              { pattern: /^.{8,64}$/, message: 'Minimum Character Length is 8 and Maximum Character Length is 64' },
            ]}>
            <Field />
          </Form.Item>
          <Form.Item
            type="text"
            label="Code"
            name="token"
            placeholder="Enter the code"
            labelIcon={
              <Tooltip
                width={280}
                title="If you don't have a code not to worry Enter your username and password and click sign in to move through the process."
                type="dark">
                <i className="material-icons-outlined">help_outline</i>
              </Tooltip>
            }
            rules={[{ pattern: /^.{6}$/, message: 'Maximum Character Length is 6' }]}
            prefix={<i className="material-icons-outlined">vpn_key</i>}>
            <Field />
          </Form.Item>
          <Button loading={user_loading} type="primary" htmlType="submit" width={150} css="margin: 0 auto;">
            Sign in
          </Button>
        </StyledForm>
      </FormHolder>
      <Modal isOpen={showTokenModal} setIsOpen={setShowTokenModal}>
        <QrModal qrImg={user} />
      </Modal>
    </LoginTemplate>
  );
}

export default Login;
