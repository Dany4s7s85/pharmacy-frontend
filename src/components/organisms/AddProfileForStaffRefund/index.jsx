/* eslint-disable no-useless-escape */
import React, { useState, useContext } from 'react';
import Grid from 'components/atoms/Grid';
import Button from 'components/atoms/Button';
import Select from 'components/atoms/Select';
import userService from 'services/userService';
import Toast from 'components/molecules/Toast';
import { AuthContext } from 'context/authContext';
import Form, { useForm } from 'components/molecules/Form';
import Field from 'components/molecules/Field';

const AddProfileForStaffRefund = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  // const [departments, setDepartments] = useState([]);
  // const [teamRoles, setTeamRoles] = useState([]);
  const [form] = useForm();

  const { refetch } = useContext(AuthContext);

  const departments = [
    { value: 'Leadership', label: 'Leadership' },
    { value: 'SEO', label: 'SEO' },
    { value: 'DEV-Onshore', label: 'DEV-Onshore' },
    { value: 'Project Management', label: 'Project Management' },
    { value: 'Client Success-Onshore', label: 'Client Success-Onshore' },
    { value: 'Client Success-Offshore', label: 'Client Success-Offshore' },
    { value: 'Business Development', label: 'Business Development' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Human Resource', label: 'Human Resource' },
    { value: 'DEV- Offshore', label: 'DEV- Offshore' },
  ];

  const teamRoles = [
    { value: 'Team Member', label: 'Team Member' },
    { value: 'Supervisor', label: 'Supervisor' },
    { value: 'Manager', label: 'Manager' },
  ];

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
    } catch (ex) {
      Toast({
        type: 'error',
        message: ex.message,
      });
      return [];
    }
  };

  // useEffect(async () => {
  //   await userService
  //     .getStaffDepartment()
  //     .then(res => {
  //       setDepartments(res.data.map(value => ({ value, label: value })));
  //     })
  //     .catch(reason => {
  //       Toast({
  //         type: 'error',
  //         message: reason?.message,
  //       });
  //     });
  //   await userService
  //     .getStaffTeamRole()
  //     .then(res => {
  //       setTeamRoles(res.data.map(value => ({ value, label: value })));
  //     })
  //     .catch(reason => {
  //       Toast({
  //         type: 'error',
  //         message: reason?.message,
  //       });
  //     });
  // }, []);

  const onSubmit = values => {
    setLoading(true);
    userService
      .submitStaffProfile(values)
      .then(res => {
        if (res.success) {
          Toast({
            type: 'success',
            message: res?.message,
          });
          setLoading(false);
          onClose();
          refetch();
        } else {
          Toast({
            type: 'error',
            message: res?.message.includes('expected `email` to be unique') ? 'Email Already Exists' : res?.message,
          });
          setLoading(false);
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
    <Form form={form} onSubmit={onSubmit}>
      <Grid xs={1}>
        <Form.Item name="customer" label="Select Customer">
          <Select sm open async defaultOptions filterOption={false} loadOptions={handleUserSearch} />
        </Form.Item>
      </Grid>
      <Grid xs={1} sm={2} gap={20}>
        <Form.Item
          name="first_name"
          rules={[
            { required: true, message: 'Please Enter First Name' },
            {
              pattern: /^.{3,50}$/,
              message: 'Minimum Length Is 3 And Max Length Is 50',
            },
          ]}
          label="First Name"
          placeholder="Enter First Name">
          <Field sm />
        </Form.Item>
        <Form.Item
          name="last_name"
          rules={[
            { required: true, message: 'Please Enter Last Name' },
            {
              pattern: /^.{3,50}$/,
              message: 'Minimum Length Is 3 And Max Length Is 50',
            },
          ]}
          label="Last Name"
          placeholder="Enter Last Name">
          <Field sm />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Please Enter Email' },
            {
              pattern:
                /^[^<>()[\]\\,;:\%#^\s@\"$&!@]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: 'Enter Valid Email Address',
            },
          ]}
          label="Email"
          placeholder="Enter Email">
          <Field sm />
        </Form.Item>
        <Form.Item
          name="phone_number"
          rules={[
            { required: true, message: 'Please Enter Phone Number' },
            { pattern: /^.{11}$/, message: 'Enter Valid Phone Number' },
          ]}
          label="Phone Number"
          type="number"
          placeholder="Enter Phone Number">
          <Field sm />
        </Form.Item>
        <Form.Item
          name="department"
          rules={[{ required: true, message: 'Please Select Department' }]}
          label="Department"
          placeholder="Select Department">
          <Select sm options={departments} />
        </Form.Item>
        <Form.Item
          name="position"
          rules={[{ required: true, message: 'Please Select Team Role' }]}
          label="Team Role"
          placeholder="Select Team Role">
          <Select sm options={teamRoles} />
        </Form.Item>
      </Grid>

      <Button type="primary" htmlType="submit" loading={loading}>
        Submit
      </Button>
    </Form>
  );
};

export default AddProfileForStaffRefund;
