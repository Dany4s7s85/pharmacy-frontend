/* eslint-disable no-unused-vars */
import React, { useState, useContext } from 'react';
import Toast from 'components/molecules/Toast';
import ConfirmationModal from 'components/molecules/ConfirmationModal';
// import { MenuItem } from 'components/molecules/MenuButton';
import Field from 'components/molecules/Field';
import Form, { useForm } from 'components/molecules/Form';
import Button from '../../atoms/Button';
import Select from '../../atoms/Select';
import businessUsersService from '../../../services/businessUsersService';
import { AuthContext } from '../../../context/authContext';

function UpdateStatus({ _, onClose = () => {} }) {
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(false);
  const { refetch } = useContext(AuthContext);
  const [form] = useForm();
  const cancelApplicationReasons = [
    { value: 'approved', label: 'Approved' },
    { value: 'cancelled', label: 'Cancelled' },
  ];
  const clientTypes = [
    { value: 'Prepaid', label: 'Prepaid' },
    { value: 'Credit', label: 'Credit' },
  ];

  const handleSubmit = async v => {
    setLoading(true);
    const payload = {
      ...v,
      client_type: v?.client_type?.value,
      status: v?.status?.value,
      business_id: _.business_info._id,
    };
    try {
      const res = await businessUsersService.updateBusinessUserStatus(payload);
      Toast({
        message: res.message,
        type: 'success',
      });
      setLoading(false);
      onClose();
      refetch();
    } catch (ex) {
      Toast({
        type: 'error',
        message: ex.message,
      });
      setLoading(false);
    }
  };
  return (
    <Form form={form} onTouched={__ => setState(prev => ({ ...prev, ...__ }))} onSubmit={handleSubmit}>
      <Form.Item
        label="Status"
        placeholder="Select a status"
        name="status"
        sm
        options={cancelApplicationReasons}
        rules={[{ required: true, message: 'Please select a status' }]}
        isSearchable>
        <Select />
      </Form.Item>
      {state?.status?.value === 'approved' && (
        <>
          <Form.Item
            label="Client Type"
            placeholder="Select Client Type"
            name="client_type"
            sm
            options={clientTypes}
            rules={[{ required: true, message: 'Please select client type' }]}
            isSearchable>
            <Select />
          </Form.Item>
          {state?.client_type?.value === 'Credit' && (
            <Form.Item
              name="credit_limit"
              label="Credit Limit"
              type="number"
              prefix="$"
              placeholder="Enter Credit Limit"
              rules={[
                { required: true, message: 'Please enter credit limit' },
                { min: 100, message: 'Credit limit must be greater than or equal to $100' },
              ]}>
              <Field />
            </Form.Item>
          )}
        </>
      )}
      <Button type="primary" htmlType="submit" loading={loading}>
        Submit
      </Button>
    </Form>
  );
}
export default UpdateStatus;
