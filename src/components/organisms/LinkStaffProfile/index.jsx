/* eslint-disable no-useless-escape */
import React, { useState, useContext } from 'react';
import Loaders from 'components/atoms/Loaders';
import Grid from 'components/atoms/Grid';
import Button from 'components/atoms/Button';
import Select from 'components/atoms/Select';
import userService from 'services/userService';
import Toast from 'components/molecules/Toast';
import { AuthContext } from 'context/authContext';
import DetailsCard from 'components/molecules/DetailsCard';
import Form, { useForm } from 'components/molecules/Form';

const LinkStaffProfile = ({ onClose, staffInfo }) => {
  const [loading, setLoading] = useState(false);
  const [form] = useForm();

  const { refetch } = useContext(AuthContext);

  const handleUserSearch = async __ => {
    try {
      const response = await userService.getUsers({
        page: 1,
        pageSize: 10,
        searchText: __,
        startDate: '',
        endDate: '',
        filterText: '',
        filterStatus: 'Active',
      });
      const options = response.customers.map(_ => ({
        value: _,
        label: `Name:${`${_?.first_name} ${_?.last_name}`}, Email: ${_?.email}`,
      }));
      return options;
    } catch {
      return [];
    }
  };

  const onSubmit = values => {
    setLoading(true);
    userService
      .linkStaffProfile(staffInfo._id, { ...values.customer.value })
      .then(res => {
        if (res.success) {
          Toast({
            type: 'success',
            message: res?.message,
          });
          setLoading(false);
          onClose();
          refetch();
        }
      })
      .catch(reason => {
        setLoading(false);
        Toast({
          type: 'error',
          message: reason?.message,
        });
      });
  };

  return (
    <Loaders loading={loading}>
      <Form form={form} onSubmit={onSubmit}>
        <DetailsCard>
          <Grid xs={1}>
            <Form.Item name="customer" label="Select Customer">
              <Select sm open async defaultOptions filterOption={false} loadOptions={handleUserSearch} />
            </Form.Item>
          </Grid>
        </DetailsCard>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </Loaders>
  );
};

export default LinkStaffProfile;
