import React, { useContext, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import Loaders from 'components/atoms/Loaders';
import Field from 'components/molecules/Field';
import Form, { useForm } from 'components/molecules/Form';
import Toast from 'components/molecules/Toast';
import Button from '../../atoms/Button';
import Select from '../../atoms/Select';
import Grid from '../../atoms/Grid';
import kycService from '../../../services/kycService';
import { AuthContext } from '../../../context/authContext';

export default function KycRejectionForm({ onClose, userId }) {
  const [form] = useForm();
  const [state, setState] = useState({
    reason: '',
    other: '',
    notes: '',
  });

  const { reason } = state;

  const [loading, setLoading] = useState(false);
  const { refetch } = useContext(AuthContext);

  const onSubmit = async data => {
    const payload = {
      reason: data?.other ? data?.other : data?.reason?.value,
      notes: data?.notes,
    };

    try {
      setLoading(true);
      const res = await kycService.reject_kyc(userId, payload);
      if (res?.success) {
        Toast({
          message: res?.message,
          type: 'success',
        });
      } else {
        Toast({
          message: res?.message,
          type: 'error',
        });
      }

      refetch();
      onClose();

      setLoading(false);
    } catch (ex) {
      setLoading(false);
      refetch();
      Toast({
        type: 'error',
        message: ex.message,
      });
    }
  };

  const rejectReasons = [
    {
      label: 'Blurry photos',
      value: 'Blurry photos',
    },
    {
      label: 'Address on ID/Utility bill do not match with Plastk profile',
      value: 'Address on ID/Utility bill do not match with Plastk profile',
    },
    {
      label: 'No real time selfie submitted',
      value: 'No real time selfie submitted',
    },
    {
      label: 'IDs must be Canadian Govt issued',
      value: 'IDs must be Canadian Govt issued',
    },
    {
      label: 'Others',
      value: 'Others',
    },
  ];

  return (
    <>
      <Loaders loading={loading}>
        <Form form={form} onSubmit={onSubmit} /* onTouched={_ => setState(__ => ({ ...__, ..._ }))} */>
          <Grid
            xs={1}
            lg={2}
            colGap={20}
            css={`
              align-items: center;
            `}>
            <Form.Item
              sm
              options={rejectReasons}
              type="text"
              label="Reason for rejection"
              name="reason"
              placeholder="reason"
              hideSelectedOptions={false}
              isMulti={false}
              value={reason}
              onChange={e => {
                const { value } = e.target;
                form.setFieldsValue({ reason: value });
                setState(prev => ({ ...prev, reason: value }));
              }}
              rules={[{ required: true, message: 'Please Select Rejection Option' }]}>
              <Select />
            </Form.Item>
            {reason.value === 'Others' && (
              <Form.Item
                sm
                label="other"
                name="other"
                placeholder="other"
                rules={[{ required: reason.value === 'Others', message: 'Please Enter Other Reason' }]}>
                <Field />
              </Form.Item>
            )}
            <Form.Item type="textarea" label="Notes" name="notes" placeholder="notes">
              <Field />
            </Form.Item>
          </Grid>

          <Button loading={loading} type="primary" htmlType="submit">
            Save
          </Button>
        </Form>
      </Loaders>
    </>
  );
}
