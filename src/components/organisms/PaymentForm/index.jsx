import React, { useState, useContext } from 'react';
import Select from 'components/atoms/Select';
import Button from 'components/atoms/Button';
import Switch from 'components/atoms/Switch';
import userService from 'services/userService';
import transactionService from 'services/transactionService';
import Form, { useForm } from 'components/molecules/Form';
import Toast from 'components/molecules/Toast';
import Field from 'components/molecules/Field';
import { AuthContext } from '../../../context/authContext';

const PaymentForm = ({ onClose = () => {} }) => {
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(true);
  const { refetch } = useContext(AuthContext);
  const handleUserSearch = value =>
    userService
      .getUsers({
        page: 1,
        pageSize: 10,
        searchText: value,
        startDate: '',
        endDate: '',
        filterText: '',
        filterStatus: 'Active',
      })
      .then(({ customers }) =>
        customers.map(_ => ({
          value: _?._id,
          label: `Name:${`${_?.first_name} ${_?.last_name}`}, Email: ${_?.email}`,
        })),
      );

  const SubmitForm = async data => {
    setLoading(true);
    await transactionService
      .searchInteracPaymentByAdmin({
        ReferenceNumber: data?.code,
        customer: data.customer.value,
        educationalEmail: email,
      })
      .then(res => {
        refetch();
        onClose();
        setLoading(false);
        onClose();
        refetch();
        Toast({
          type: 'success',
          message: res?.message,
        });
      })
      .catch(err => {
        setLoading(false);
        Toast({
          type: 'error',
          message: err?.message,
        });
      });
  };

  return (
    <Form form={form} onSubmit={SubmitForm}>
      <Form.Item
        label="Select Customer"
        name="customer"
        rules={[{ required: true, message: 'Please select your customer' }]}>
        <Select sm open async cacheOptions defaultOptions filterOption={false} loadOptions={handleUserSearch} />
      </Form.Item>
      <Form.Item
        label="Interac Reference code"
        sm
        name="code"
        placeholder="Enter Interac Reference code"
        rules={[
          { required: true, message: 'Please enter your interac code' },
          { pattern: /^.{0,10}$/, message: 'Maximum Character Length Is 10' },
        ]}>
        <Field />
      </Form.Item>
      <Switch
        type="checkbox"
        label="Send Educational Email"
        name="educationalEmail"
        value={email}
        onChange={() => setEmail(!email)}
      />

      <Button type="primary" htmlType="submit" loading={loading}>
        Submit
      </Button>
    </Form>
  );
};

export default PaymentForm;
