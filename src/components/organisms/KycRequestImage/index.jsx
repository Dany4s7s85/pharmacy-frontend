/* eslint-disable no-unused-vars */
import React, { useContext, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import Loaders from 'components/atoms/Loaders';
import Field from 'components/molecules/Field';
import Form, { useForm } from 'components/molecules/Form';
import Toast from 'components/molecules/Toast';
import DetailsCard from 'components/molecules/DetailsCard';
import InfoCard from 'components/molecules/InfoCard';
import Button from '../../atoms/Button';
import Select from '../../atoms/Select';
import Grid from '../../atoms/Grid';
import kycService from '../../../services/kycService';
import { AuthContext } from '../../../context/authContext';

export default function KycRequestImage({ onClose, userId, kycData }) {
  const [form] = useForm();
  const [state, setState] = useState({
    reason: '',
    image: '',
    notes: '',
  });

  const { reason, image } = state;
  const [loading, setLoading] = useState(false);
  const { refetch } = useContext(AuthContext);

  const onSubmit = async data => {
    const imageValues = data?.image?.map(item => item.value);
    const payload = {
      userId,
      requestedImage: imageValues,
      rejectionReason: data?.other ? data?.other : data?.reason?.value,
    };
    try {
      const res = await kycService.request_kyc_image(payload);
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
  const ImageRequested = [
    {
      label: `${kycData.photo_id_type} Front Photo `,
      value: `Front Photo`,
    },
    {
      label: `${kycData.photo_id_type} Back Photo`,
      value: `Back Photo`,
    },

    {
      label: 'Selfie',
      value: 'Selfie',
    },
  ];
  if (kycData.utility_doc) {
    ImageRequested.push({
      label: 'Additional Doc',
      value: 'Additional Doc',
    });
  }
  return (
    <>
      <Loaders loading={loading}>
        <DetailsCard gray>
          <InfoCard title="Card Type" value={kycData?.photo_id_type} />
        </DetailsCard>
        <Form form={form} onSubmit={onSubmit}>
          <Grid
            xs={1}
            lg={2}
            colGap={20}
            css={`
              align-items: center;
            `}>
            <Form.Item
              sm
              options={ImageRequested}
              type="text"
              label="Select Photo"
              name="image"
              placeholder="Photo to request"
              hideSelectedOptions={false}
              isMulti
              value={image}
              onChange={e => {
                const { value } = e.target;
                form.setFieldsValue({ image: value });
                setState(prev => ({ ...prev, image: value }));
              }}
              rules={[{ required: true, message: 'Please Select Photos type' }]}>
              <Select />
            </Form.Item>
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
                placeholder="Specify reson"
                rules={[{ required: reason.value === 'Others', message: 'Please Enter Other Reason' }]}>
                <Field />
              </Form.Item>
            )}
          </Grid>

          <Button loading={loading} type="primary" htmlType="submit">
            Save
          </Button>
        </Form>
      </Loaders>
    </>
  );
}
