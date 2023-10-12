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

function PermissionForm({ permission, onClose = () => {} }) {
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const { refetch } = useContext(AuthContext);
  const {
    permissions_data: { permissions },
  } = adminService.GetPermissions({
    parentOnly: true,
  });
  const permissionOptions = useMemo(
    () => [
      {
        label: 'No-Parent',
        value: '$',
      },
      ...permissions.map(({ can }) => ({
        label: can.split('.nav')[0],
        value: can.split('.nav')[0],
      })),
    ],
    [permissions],
  );
  useEffect(() => {
    if (permission) {
      form.setFieldsValue({
        can: permission.can,
        description: permission.description,
        route: permission.route,
        parent: permissionOptions.filter(({ value }) => permission.parent.includes(value)),
      });
    }
  }, [permission, permissionOptions]);

  const onSubmit = async data => {
    try {
      setLoading(true);
      if (permission) {
        await adminService.updatePermission(permission._id, {
          can: data.can,
          description: data.description,
          route: data.route,
          parent: data.parent.map(({ value }) => value),
        });
      } else {
        await adminService.createPermission({
          can: data.can,
          description: data.description,
          route: data.route,
          parent: data.parent.map(({ value }) => value),
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
    <Form form={form} onSubmit={onSubmit}>
      <Grid
        xs={1}
        lg={2}
        colGap={20}
        css={`
          align-items: center;
        `}>
        <Form.Item
          sm
          type="text"
          label="Route"
          name="route"
          placeholder="Route"
          rules={[
            { required: true, message: 'Please enter can' },
            {
              pattern: /^[a-zA-Z/_.-]+$/,
              message: 'Can can only contain letters,underscores and dashes',
            },
            {
              pattern: /^.{0,40}$/,
              message: 'Maximum Character Length Is 40',
            },
          ]}>
          <Field />
        </Form.Item>
        <Form.Item
          sm
          type="text"
          label="Can"
          name="can"
          placeholder="Can"
          rules={[
            { required: true, message: 'Please enter can' },
            {
              pattern: /^[a-zA-Z._-]+$/,
              message: 'Can can only contain letters,underscores and dashes',
            },
            {
              pattern: /^.{0,40}$/,
              message: 'Maximum Character Length Is 40',
            },
          ]}>
          <Field />
        </Form.Item>
        <Form.Item
          sm
          type="text"
          label="Description"
          name="description"
          placeholder="Description"
          rules={[
            { required: true, message: 'Please enter description' },
            {
              pattern: /^.{0,40}$/,
              message: 'Maximum Character Length Is 40',
            },
          ]}>
          <Field />
        </Form.Item>

        <Form.Item
          sm
          options={permissionOptions}
          isSearchable
          isMulti
          name="parent"
          label="Parent"
          placeholder="Select Parent"
          hideSelectedOptions={false}
          closeMenuOnSelect={false}
          rules={[
            { required: true, message: 'Select atleast one role' },
            {
              transform: value => !value?.length,
              message: 'Select at least one parent',
            },
          ]}>
          <Select />
        </Form.Item>
      </Grid>

      <Button loading={loading} type="primary" htmlType="submit">
        Save
      </Button>
    </Form>
  );
}

export default PermissionForm;
