import React, { useState, useMemo, useContext } from 'react';
import Grid from 'components/atoms/Grid';
import Select from 'components/atoms/Select';
import Toast from 'components/molecules/Toast';
import adminService from 'services/adminService';
import Button from 'components/atoms/Button';
import Loaders from 'components/atoms/Loaders';
import { AuthContext } from 'context/authContext';
import { Flex } from 'styles/helpers.styles';
// eslint-disable-next-line no-unused-vars
import { css } from 'styled-components/macro';
import Form, { useForm } from '../Form';

const AddBusinessAssociates = ({ onClose, business }) => {
  const [loading, setLoading] = useState(false);
  const [form] = useForm();
  const { refetch } = useContext(AuthContext);

  const { admins_data, admins_loading } = adminService.GetAdmins({
    page: 1,
    pageSize: 10,
    searchText: '',
    filterRoles: 'BAP_ROLES',
    startDate: '',
    endDate: '',
    getAll: true,
  });
  const { admins } = useMemo(() => {
    let count = 0;
    const customOptions = admins_data?.admins?.map(_ => {
      const arrOfRoles = _.roles.map(role => {
        count += 1;
        return {
          value: count,
          adminId: _?._id,
          label: `Name:${_.username}, Email: ${_?.email} ,Role: ${role?.type}`,
          roleId: role?._id,
        };
      });
      return arrOfRoles;
    });
    if (admins_data?.admins?.length && business?.business_info?.admins?.length) {
      const selectedOptions = customOptions
        .flat()
        ?.filter(admin =>
          business?.business_info?.admins?.find(_ => _?.adminId === admin?.adminId && _?.roles.includes(admin?.roleId)),
        );
      if (selectedOptions?.length) {
        form.setFieldsValue({ Admin: selectedOptions });
      }
    }
    return {
      admins: customOptions.flat(),
    };
  }, [admins_data]);

  const onSubmit = async values => {
    setLoading(true);
    await adminService
      .assignBusinessess({
        admins: values?.Admin?.map(admin => ({
          adminId: admin?.adminId,
          roleId: admin?.roleId,
        })),
        business: business?.business_info?._id,
        removeAll: false,
      })
      .then(res => {
        setLoading(false);
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
          message: reason.message,
        });
      });
  };

  const removeAllUsers = () => {
    setLoading(true);
    adminService
      .assignBusinessess({
        admins: [],
        business: business?.business_info?._id,
        removeAll: true,
      })
      .then(res => {
        setLoading(false);
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
          message: reason.message,
        });
      });
  };
  return (
    <Loaders loading={loading}>
      <Form form={form} onSubmit={onSubmit}>
        <Grid xs={1}>
          <Form.Item
            name="Admin"
            label="Select Admin"
            rules={[
              { required: true, message: 'Select atleast one admin' },
              {
                transform: value => !value?.length,
                message: 'Select at least one admin',
              },
            ]}>
            <Select
              sm
              options={admins}
              isSearchable
              loading={admins_loading}
              isMulti
              hideSelectedOptions={false}
              closeMenuOnSelect={false}
            />
          </Form.Item>
        </Grid>
        {!!business?.business_info?.admins?.length && (
          <Flex justify="end" css="margin-bottom:10px;">
            <Button type="primary" width={100} onClick={removeAllUsers}>
              Remove All
            </Button>
          </Flex>
        )}
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </Loaders>
  );
};

export default AddBusinessAssociates;
