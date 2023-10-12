import React, { useState, useContext } from 'react';
import Toast from 'components/molecules/Toast';
import ConfirmationModal from 'components/molecules/ConfirmationModal';
import Button from '../../atoms/Button';
import Select from '../../atoms/Select';
import businessUsersService from '../../../services/businessUsersService';
import { AuthContext } from '../../../context/authContext';

function UpdateCreditStatus({ _, onClose = () => {} }) {
  const [status, setStatus] = useState({});
  const { refetch } = useContext(AuthContext);

  const cancelApplicationReasons = [
    { value: 'Approved', label: 'Approved' },
    { value: 'Rejected', label: 'Rejected' },
  ];

  const updateStatus = async () => {
    try {
      const res = await businessUsersService.updateBusinessCreditStatus(_._id, _.business_user._id, status);
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
        label="Status"
        placeholder="Select a Status"
        onChange={e => {
          setStatus(e.target.value.value);
        }}
      />
      <ConfirmationModal
        title="Update status"
        subtitle="Are you sure you want to update the status"
        confirmationModal="Yes"
        onOk={updateStatus}
        btnComponent={({ onClick }) => (
          <Button type="primary" htmlType="submit" onClick={onClick}>
            Submit{' '}
          </Button>
        )}
      />
    </>
  );
}
export default UpdateCreditStatus;
