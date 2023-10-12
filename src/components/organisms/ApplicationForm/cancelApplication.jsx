import React, { useState, useContext } from 'react';
import Toast from 'components/molecules/Toast';
import Button from '../../atoms/Button';
import Select from '../../atoms/Select';
import applicationService from '../../../services/applicationService';
import { AuthContext } from '../../../context/authContext';

function CancelApplication({ _, onClose = () => {} }) {
  const [reason, setReason] = useState({});
  const { refetch } = useContext(AuthContext);

  const cancelApplicationReasons = [
    { value: 'Bad service provider', label: 'Bad service provider' },
    { value: 'I dont like this', label: 'I dont like this' },
    { value: 'Will come again in future', label: 'Will come again in future' },
    { value: 'Wanted an unsecured card', label: 'Wanted an unsecured card' },
    { value: 'Closed by customer request', label: 'Closed by customer request' },
  ];

  const cancelApplication = async () => {
    try {
      await applicationService.cancelApplication(reason, _);
      Toast({
        message: 'Application Cancelled successfully',
        type: 'success',
      });
      onClose();
      refetch();
    } catch (ex) {
      Toast({
        type: 'error',
        message: ex?.message,
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
          setReason(e.target.value.value);
        }}
      />
      <Button type="danger" onClick={cancelApplication}>
        Submit
      </Button>
    </>
  );
}
export default CancelApplication;
