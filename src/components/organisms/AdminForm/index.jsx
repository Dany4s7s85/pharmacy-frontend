import React, { useContext, useEffect, useMemo, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import { AuthContext } from 'context/authContext';
import Button from 'components/atoms/Button';
import Grid from 'components/atoms/Grid';
import Select from 'components/atoms/Select';
import adminService from 'services/adminService';
import Field from 'components/molecules/Field';
import Form, { useForm } from 'components/molecules/Form';
import Toast from 'components/molecules/Toast';

function AdminForm({ admin, passwordOnly, onClose = () => {} }) {
  const [form] = useForm();
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(false);
  const { refetch } = useContext(AuthContext);
  const { roles_data } = adminService.GetRoles({ getAll: true });
  const roles = useMemo(() => roles_data.roles.map(({ _id, type }) => ({ value: _id, label: type })), [roles_data]);
  // const permissions = useMemo(
  //   () =>
  //     roles_data?.roles
  //       .filter(({ _id }) => state?.roles?.find(({ value }) => value === _id))
  //       .map(({ permissions: _ }) => _)
  //       .flat(Infinity)
  //       .filter((permission, index, self) => index === self.findIndex(({ _id }) => _id === permission._id))
  //       .map(({ _id }) => _id),
  //   [state?.roles, roles_data],
  // );
  useEffect(() => {
    if (admin && !passwordOnly) {
      form.setFieldsValue({
        username: admin?.username,
        email: admin?.email,
        roles: roles?.filter(({ value }) => admin?.roles?.find(({ _id }) => _id === value)),
      });
      setState({
        username: admin?.username,
        email: admin?.email,
        roles: roles?.filter(({ value }) => admin?.roles?.find(({ _id }) => _id === value)),
      });
    }
  }, [roles_data, admin, passwordOnly, roles]);
  const onSubmit = async data => {
    try {
      setLoading(true);
      if (admin && !passwordOnly) {
        // edit admin
        await adminService.updateAdmin(admin._id, {
          username: data.username,
          email: data.email,
          password: data.password,
          permissions: state.permissions,
          roles: data.roles.map(({ value }) => value),
        });
      } else if (admin && passwordOnly) {
        await adminService.updateAdmin(admin._id, {
          password: data.password,
        });
      } else {
        await adminService.addAdmin({
          username: data.username,
          email: data.email,
          password: data.password,
          permissions: state.permissions,
          roles: data.roles.map(({ value }) => value),
        });
      }
      refetch();
      onClose();
      setLoading(false);
      Toast({
        type: 'success',
        message: 'Admin saved successfully',
      });
    } catch (ex) {
      setLoading(false);
      Toast({
        type: 'error',
        message: ex.message,
      });
    }
  };

  return (
    <Form form={form} onSubmit={onSubmit} onTouched={_ => setState(__ => ({ ...__, ..._ }))}>
      <Grid
        xs={1}
        lg={2}
        colGap={20}
        css={`
          align-items: center;
        `}>
        {!passwordOnly && (
          <Form.Item
            disabled={passwordOnly}
            sm
            type="text"
            label="Username"
            name="username"
            placeholder="Username"
            rules={[
              { required: true, message: 'Please enter username' },
              {
                pattern: /^[a-zA-Z_ ]*$/,
                message: 'Username should be alphabet',
              },
              {
                pattern: /^[a-zA-Z_ ]{2,}$/,
                message: 'Username must be minimum 2 characters.',
              },
              {
                pattern: /^[a-zA-Z_ ]{2,25}$/,
                message: 'Username should be maximum 25 characters',
              },
            ]}>
            <Field />
          </Form.Item>
        )}
        {!passwordOnly && (
          <Form.Item
            disabled={passwordOnly}
            sm
            type="email"
            label="Email"
            name="email"
            placeholder="Email"
            rules={[
              { required: true, message: 'Please enter email address' },
              { email: true, message: 'Please enter a valid email' },
              { max: 40, message: 'Email should be at max 40 characters!' },
            ]}>
            <Field />
          </Form.Item>
        )}
        {(passwordOnly || !admin) && (
          <Form.Item
            type="password"
            label="Password"
            name="password"
            placeholder="Password"
            rules={[
              {
                required: true,
              },
              { password: true },
              { pattern: /^.{8,64}$/, message: 'Minimum Character Length is 8 and Maximum Character Length is 64' },
            ]}>
            <Field />
          </Form.Item>
        )}
        {(passwordOnly || !admin) && (
          <Form.Item
            type="password"
            label="Confirm Password"
            name="confirm_password"
            placeholder="Confirm Password"
            rules={[
              {
                required: true,
              },
              {
                password: true,
              },
              {
                transform: value => value !== form.getFieldValue('password'),
                message: 'The two passwords that you entered do not match!',
              },
            ]}>
            <Field />
          </Form.Item>
        )}
        {!passwordOnly && (
          <Form.Item
            sm
            options={roles}
            isSearchable
            isMulti
            name="roles"
            label="Role"
            placeholder="Role"
            hideSelectedOptions={false}
            closeMenuOnSelect={false}
            rules={[
              { required: true, message: 'Select atleast one role' },
              {
                transform: value => !value?.length,
                message: 'Select at least one role',
              },
            ]}>
            <Select />
          </Form.Item>
        )}
        {/* not to be used anymore */}
        {/* {!passwordOnly && (
          <PermissionSelector permissions={permissions} onDone={__ => setState(_ => ({ ..._, permissions: __ }))} />
        )} */}
      </Grid>

      <Button loading={loading} type="primary" htmlType="submit">
        Save
      </Button>
    </Form>
  );
}

export default AdminForm;
