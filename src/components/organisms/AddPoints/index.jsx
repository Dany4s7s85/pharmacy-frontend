import Button from 'components/atoms/Button';
import Loaders from 'components/atoms/Loaders';
import Select from 'components/atoms/Select';
import React, { useMemo, useState, useContext } from 'react';
import transactionService from 'services/transactionService';
import Field from 'components/molecules/Field';
import Form, { useForm } from 'components/molecules/Form';
import Toast from 'components/molecules/Toast';
import { AuthContext } from 'context/authContext';

export default function AddPoints({ customer, userInfo }) {
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const { channels_data, channels_loading } = transactionService.GetPlastkChannel({ type: 'CSR Points Award' });
  const { refetch } = useContext(AuthContext);
  const requestType = useMemo(
    () =>
      channels_data?.map(_ => ({
        value: _?._id,
        label: `${_.code} : ${_.description}`,
      })),
    [channels_data],
  );
  const addPoints = async ({ plastk_channel, points_to_be_added, notes }) => {
    try {
      setLoading(true);
      await transactionService.pendingPointRequest({
        user: customer?._id,
        plastk_channel: plastk_channel.value,
        notes,
        points: points_to_be_added,
      });
      setLoading(false);
      Toast({
        message: 'Points added successfully',
        type: 'success',
      });
      refetch();
    } catch (ex) {
      setLoading(false);
      Toast({
        type: 'error',
        message: ex.message,
      });
      refetch();
    }
  };

  return (
    <Loaders loading={loading || channels_loading}>
      {userInfo}
      <Form form={form} onSubmit={addPoints}>
        <Form.Item
          isDisabled={channels_loading}
          options={requestType}
          label="Request Type"
          name="plastk_channel"
          sm
          rules={[
            {
              required: true,
            },
          ]}>
          <Select />
        </Form.Item>
        <Form.Item
          label="Points To Be Added"
          type="number"
          name="points_to_be_added"
          sm
          placeholder="Enter how much points to be added"
          rules={[
            {
              required: true,
              message: 'Points To Be Added is Required',
            },
            { min: 0, message: 'Minimum points to be added is 0' },
            { max: 5000, message: 'Maximum points to be added is 5000' },
          ]}>
          <Field />
        </Form.Item>
        <Form.Item
          label="Notes"
          name="notes"
          type="textarea"
          sm
          placeholder="Enter Notes here"
          rules={[
            {
              required: true,
            },
            {
              pattern: /^[a-zA-Z0-9./$!& ()><@#*^%?,']{0,200}$/,
              message: 'Notes must be maximum 200 characters.',
            },
          ]}>
          <Field />
        </Form.Item>
        <Button type="primary" width={130} htmlType="submit">
          Submit
        </Button>
      </Form>
    </Loaders>
  );
}
