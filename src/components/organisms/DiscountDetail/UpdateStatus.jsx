import React, { useState, useContext } from 'react';
import Toast from 'components/molecules/Toast';
import Button from '../../atoms/Button';
import Select from '../../atoms/Select';
import userService from '../../../services/userService';
import { AuthContext } from '../../../context/authContext';

function UpdateStatus({ _, onClose = () => {} }) {
  const [status, setStatus] = useState({});
  const { refetch } = useContext(AuthContext);

  const cancelApplicationReasons = [
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  const updateStatus = async () => {
    try {
      const res = await userService.updateDiscountStatus(_._id, status);
      Toast({
        message: res.message,
        type: 'success',
      });
      onClose();
      refetch();
    } catch (ex) {
      Toast({
        type: 'error',
        message: ex.message,
      });
      onClose();
      refetch();
    }
  };

  return (
    <>
      <Select
        sm
        options={cancelApplicationReasons}
        isSearchable
        label="Reason"
        placeholder="Select a Reason"
        onChange={e => {
          setStatus(e.target.value.value);
        }}
      />
      <Button type="primary" onClick={updateStatus}>
        Submit
      </Button>
    </>
  );
}
export default UpdateStatus;
