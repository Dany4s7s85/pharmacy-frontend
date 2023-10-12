/* eslint-disable no-param-reassign */
import React, { useState, useEffect, useContext } from 'react';
import Button from 'components/atoms/Button';
import Grid from 'components/atoms/Grid';
// eslint-disable-next-line no-unused-vars
import { subYears, addYears } from 'date-fns';
import userService from 'services/userService';
import Field from 'components/molecules/Field';
import Form, { useForm } from 'components/molecules/Form';
import Toast from 'components/molecules/Toast';
import { getDateObject } from 'helpers/common';
// import Icon from 'components/atoms/Icon';
import { AuthContext } from '../../../context/authContext';

function AccountClosureForm({ customer, onClose = () => {} }) {
  const [form] = useForm();
  const [suspensionDate, setSuspensionDate] = useState(subYears(getDateObject(new Date()), 18));
  const [closureDate, setClosureDate] = useState(subYears(getDateObject(new Date()), 18));
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const { refetch } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    setSelectedCustomer(customer);
  };

  useEffect(() => {
    fetch();
  }, []);

  const onSubmit = async data => {
    try {
      setLoading(true);
      await userService
        .updateAccountClosureDetails(selectedCustomer._id, {
          ...data,
        })
        .then(res => {
          if (res.success) {
            refetch();
            onClose();
            setLoading(false);
            Toast({
              type: 'success',
              message: res.message,
            });
          } else {
            onClose();
            setLoading(false);
            Toast({
              type: 'error',
              message: res.message,
            });
          }
        });
    } catch (ex) {
      refetch();
      setLoading(false);
      Toast({
        type: 'error',
        message: ex?.message,
      });
    }
  };

  useEffect(() => {
    if (selectedCustomer) {
      const timeSplitSus = selectedCustomer.suspended_on.split('-');
      const yearSus = timeSplitSus[0];
      const monthSus = timeSplitSus[1];
      const daySus = timeSplitSus[2].split('T')[0];

      const timeSplitClo = selectedCustomer.refund_date.split('-');
      const yearClo = timeSplitClo[0];
      const monthClo = timeSplitClo[1];
      const dayClo = timeSplitClo[2].split('T')[0];

      form.setFieldsValue({
        suspension_date: `${yearSus}-${monthSus}-${daySus}` ?? '',
        closure_date: `${yearClo}-${monthClo}-${dayClo}` ?? '',
        first_name: selectedCustomer.user.first_name ?? '',
        last_name: selectedCustomer.user.last_name ?? '',
        email: selectedCustomer.user.email ?? '',
        refund_amount: selectedCustomer.refund_amount ?? '',
        deductions: selectedCustomer.deductions ?? '',
      });
    }
  }, [selectedCustomer]);

  return (
    <>
      <Form form={form} onSubmit={onSubmit}>
        <Grid xs={1} lg={3} colGap={20}>
          <Form.Item
            disabled
            sm
            type="text"
            label="First Name"
            name="first_name"
            placeholder="First Name"
            onChange={e => {
              form.setFieldsValue({ emboss: '', first_name: e.target.value });
            }}
            rules={[
              { required: true, message: 'Please enter first name' },
              {
                pattern: /^[a-zA-Z\s]*$/,
                message: 'First name should be alphabets!',
              },
              {
                pattern: /^[a-zA-Z_ ]{2,}$/,
                message: 'First Name must be minimum 2 characters.',
              },
              {
                pattern: /^[a-zA-Z_ ]{2,40}$/,
                message: 'First Name must be maximum 40 characters.',
              },
            ]}>
            <Field />
          </Form.Item>
          <Form.Item
            disabled
            sm
            type="text"
            label="Last Name"
            name="last_name"
            placeholder="Last Name"
            onChange={e => {
              form.setFieldsValue({ emboss: '', last_name: e.target.value });
            }}
            rules={[
              { required: true, message: 'Please input your last name' },
              {
                pattern: /^[a-zA-Z\s]*$/,
                message: 'Last name should be alphabets!',
              },
              {
                pattern: /^[a-zA-Z_ ]{2,}$/,
                message: 'Last Name must be minimum 2 characters.',
              },
              {
                pattern: /^[a-zA-Z_ ]{2,40}$/,
                message: 'Last Name must be maximum 40 characters.',
              },
            ]}>
            <Field />
          </Form.Item>
        </Grid>
        <Form.Item
          disabled
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
        <Grid lg={2} colGap={20}>
          <Form.Item
            sm
            name="suspension_date"
            label="Suspension Date"
            selected={suspensionDate}
            onChange={date => {
              form.setFieldsValue({ suspension_date: date.target.value ? getDateObject(date.target.value) : '' });
              setSuspensionDate(getDateObject(date.target.value));
            }}
            isClearable
            prefix={<i className="material-icons-outlined">date_range</i>}
            placeholderText="Select date range"
            // excludeDateIntervals={[
            //   { start: subYears(getDateObject(new Date()), 18), end: addYears(getDateObject(new Date()), 1) },
            // ]}
            type="datepicker"
            noMargin>
            <Field />
          </Form.Item>
          <Form.Item
            sm
            name="closure_date"
            label="Closure Date"
            selected={closureDate}
            onChange={date => {
              form.setFieldsValue({ closure_date: date.target.value ? getDateObject(date.target.value) : '' });
              setClosureDate(getDateObject(date.target.value));
            }}
            isClearable
            prefix={<i className="material-icons-outlined">date_range</i>}
            placeholderText="Select date range"
            // excludeDateIntervals={[
            //   { start: subYears(getDateObject(new Date()), 18), end: addYears(getDateObject(new Date()), 1) },
            // ]}
            type="datepicker"
            noMargin>
            <Field />
          </Form.Item>
          <Form.Item
            sm
            disabled
            type="number"
            name="deductions"
            label="Deductions"
            placeholder="deductions"
            rules={[
              {
                required: true,
                message: 'Please enter the refund amount',
              },
              { pattern: /^\d+$/, message: 'Only Whole Numbers Are Allowed' },
            ]}>
            <Field />
          </Form.Item>
          <Form.Item
            sm
            type="number"
            name="refund_amount"
            label="Refund Amount"
            placeholder="Refund Amount"
            rules={[
              {
                required: true,
                message: 'Please enter the refund amount',
              },
              // { pattern: /^\d+$/, message: 'Only Whole Numbers Are Allowed' },
            ]}>
            <Field />
          </Form.Item>
        </Grid>
        <Button loading={loading} type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </>
  );
}

export default AccountClosureForm;
