import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import Grid from 'components/atoms/Grid';
import Button from 'components/atoms/Button';
import Slider from 'components/atoms/Slider';
import InfoCard from 'components/molecules/InfoCard';
import DetailsCard from 'components/molecules/DetailsCard';
import Heading from 'components/atoms/Heading';
import ConfirmationModal from 'components/molecules/ConfirmationModal';
import Field from 'components/molecules/Field';
import Form, { useForm } from 'components/molecules/Form';
import Toast from 'components/molecules/Toast';
// import { StyledTextarea } from 'components/atoms/Input/Input.styles';
import notificationService from 'services/notificationService';
import transactionService from '../../../services/transactionService';
import { convertToCurrencyFormat } from '../../../helpers/common';
// eslint-disable-next-line no-unused-vars
function ApproveForm({ data, user, onSubmit, refetch, onClose }) {
  const [form] = useForm();
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [emptyNoteDisable, setEmptyNoteDisable] = useState(true);
  const [sliderChange, setSliderChange] = useState(false);
  const [disableChatSubmit, setDisableChatSubmit] = useState(true);
  const approveRefund = async () => {
    const payload = {
      userId: data.user._id,
      convertedValue: form.getFieldValue('amount_to_be_added'),
      edit_notes: form.getFieldValue('edit_notes'),
      transactionId: data.transactionId._id,
      submitType: 'approve',
    };
    await transactionService.updateRefundRequest(payload).then(res => {
      if (res?.success) {
        Toast({
          type: 'success',
          message: res.message,
        });
        refetch();
      } else {
        Toast({
          type: 'error',
          message: res.message,
        });
      }
    });
  };

  const rejectRefund = async () => {
    const payload = {
      userId: data.user._id,
      edit_notes: form.getFieldValue('edit_notes'),
      transactionId: data.transactionId._id,
      submitType: 'reject',
    };
    await transactionService.updateRefundRequest(payload).then(res => {
      if (res?.success) {
        Toast({
          type: 'success',
          message: res.message,
        });
        refetch();
      } else {
        Toast({
          type: 'error',
          message: res.message,
        });
      }
    });
  };

  const submitChat = async () => {
    const payload = {
      userId: data.user._id,
      chat_notes: form.getFieldValue('chat_notes'),
      transactionId: data.transactionId._id,
      submitType: 'chat',
    };
    const res = await transactionService.updateRefundRequest(payload);
    if (res?.success) {
      console.log(res);
      await notificationService.sendNotification({
        requested_by: user._id,
        responded_by: data.updatedBy._id,
        notification_type: 'NOTICE',
        notification_text: `You have a new message on Account Credit from ${user.username}`,
        // status: 'Pending',
      });
      Toast({
        type: 'success',
        message: 'Chat Sent',
      });
      refetch();
    } else {
      Toast({
        type: 'error',
        message: res.message,
      });
    }
    onClose();
  };
  const marks = {
    0: '0%',
    25: '25%',
    50: '50%',
    75: '75%',
    100: {
      style: {
        color: '#f50',
      },
      label: <strong>100%</strong>,
    },
  };

  useEffect(() => {
    form.setFieldsValue({
      amount_to_be_added: 0,
      slider: 0,
    });
  }, [data]);

  return (
    <>
      <Grid xs={1} sm={2} gap={20} css="margin-bottom: 20px;">
        <InfoCard title="Name" value={`${data?.user?.first_name} ${data?.user?.last_name}`} $unStyled />
        <InfoCard title="Email" value={data?.user?.email} $unStyled />
        <InfoCard title="Transaction Amount:" value={convertToCurrencyFormat(data?.refundAmount)} $unStyled />
        <InfoCard title="Requested Amount: " value={convertToCurrencyFormat(data?.refundRequested)} $unStyled />
      </Grid>
      <Form
        form={form}
        onSubmit={onSubmit}
        onTouched={_ => {
          const [field, value] = Object.entries(_)[0];
          if (field === 'slider') {
            form.setFieldsValue({
              amount_to_be_added: ((data?.refundAmount / 100) * value).toFixed(2),
            });
            if (!value > 0) {
              setDisableSubmit(true);
              setSliderChange(false);
            } else {
              setDisableSubmit(false);
              setSliderChange(true);
            }
          }
          if (field === 'edit_notes') {
            if (value.length > 9 && value.length < 200) {
              setEmptyNoteDisable(false);
            } else {
              setEmptyNoteDisable(true);
            }
          }
          if (field === 'chat_notes') {
            if (value.length > 9 && value.length < 200) {
              setDisableChatSubmit(false);
            } else {
              setDisableChatSubmit(true);
            }
          }
        }}>
        <Form.Item sm type="number" disabled label="Edit Amount ($)" name="amount_to_be_added">
          <Field />
        </Form.Item>

        <Form.Item
          marks={marks}
          formatOptions={{ style: 'percent' }}
          steps={null}
          label="Credit Percentage"
          name="slider"
          step={null}>
          <Slider />
        </Form.Item>

        <Form.Item
          type="textarea"
          placeholder="Enter notes here"
          label="Add Notes"
          name="edit_notes"
          rules={[
            {
              required: true,
              message: 'Please enter notes here.',
            },
          ]}>
          <Field />
        </Form.Item>
        {/* <div> */}
        <Heading level={4}>Previous Notes:</Heading>
        <div css="overflow-y: scroll; scroll-behavior: smooth;max-height: 400px; ">
          {data?.notes?.map(note => (
            <DetailsCard
              gray
              css="margin-bottom: 10px; padding-top: 2px; padding-bottom: 10px;
              overflow: hidden;">
              {note?.split(':').length === 1 ? (
                <p>{note}</p>
              ) : (
                <div>
                  <p css="font-weight: bold; font-size: var(--font-size-xs); padding-bottom: 5px; color: var(--text-color-gray)">
                    {note?.split(`:`).slice(0, -1).join(`:`)}
                  </p>
                  <p css="color: var(--text-color-black); font-size: var(--font-size-sm)"> {note?.split(`:`).pop()} </p>
                </div>
              )}
            </DetailsCard>
          ))}
        </div>
        <Form.Item
          type="textarea"
          placeholder="Enter chats here"
          label="Chat Back Notes"
          name="chat_notes"
          rules={[
            {
              required: true,
              message: 'Please chat back notes here.',
            },
          ]}>
          <Field />
        </Form.Item>
        <Button type="primary" disabled={disableChatSubmit} onClick={submitChat} width={80}>
          Submit
        </Button>
        {/* </div> */}
        <Form.Item>
          <div
            css={`
              display: flex;
              justify-content: flex-end;
              gap: 20px;
            `}>
            <ConfirmationModal
              onOk={approveRefund}
              title={`Are you sure you want to approve the refund of ${form.getFieldValue('amount_to_be_added')} for ${
                data?.user?.first_name
              } ${data?.user?.last_name}?`}
              confirmationModal="yes"
              btnComponent={({ onClick }) => (
                <Button type="primary" disabled={disableSubmit || emptyNoteDisable} onClick={onClick} width={120}>
                  Approve
                </Button>
              )}>
              <Grid xs={1} sm={2} gap={20}>
                <InfoCard title="Name" value={`${data?.user?.first_name} ${data?.user?.last_name}`} $unStyled />
                <InfoCard title="Email" value={data?.user?.email} $unStyled />
              </Grid>
            </ConfirmationModal>
            <ConfirmationModal
              onOk={rejectRefund}
              title="Are you sure you want to reject the refund request?"
              confirmationModal="yes"
              btnComponent={({ onClick }) => (
                <Button type="danger" disabled={sliderChange || emptyNoteDisable} onClick={onClick} width={120}>
                  Reject
                </Button>
              )}>
              <Grid xs={1} sm={2} gap={20}>
                <InfoCard title="Name" value={`${data?.user?.first_name}${data?.user?.last_name}`} $unStyled />
                <InfoCard title="Email" value={data?.user?.email} $unStyled />
              </Grid>
            </ConfirmationModal>
          </div>
        </Form.Item>
      </Form>
    </>
  );
}
export default ApproveForm;
