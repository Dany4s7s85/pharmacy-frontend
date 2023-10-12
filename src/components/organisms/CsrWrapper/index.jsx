import React, { useState, useEffect, useContext } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import Heading from 'components/atoms/Heading';
import Grid from 'components/atoms/Grid';
import GridCol from 'components/atoms/GridCol';
import Select from 'components/atoms/Select';
import Field from 'components/molecules/Field';
import { AuthContext } from 'context/authContext';
import Loaders from 'components/atoms/Loaders';
import Toast from 'components/molecules/Toast';
import notificationService from 'services/notificationService';
import Button from 'components/atoms/Button';
import { differenceInSeconds } from 'date-fns';
import { getDateObject } from 'helpers/common';
import userService from 'services/userService';
import Form, { useForm } from 'components/molecules/Form';

export default function CsrWrapper({ children, customer, isApplication = false }) {
  const [form] = useForm();
  const [selectedDate, setSelectedDate] = useState(getDateObject(new Date()));
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    validate: 'otp',
    can_request_csr: false,
  });
  const { hasPermission, user } = useContext(AuthContext);
  const [event, setEvent] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);
  let timer;
  const reqSupervisorOptions = [
    {
      value: 'Verify Customer Information',
      label: 'Verify Customer Information',
    },
    {
      value: 'Address Change / Personal Information Update',
      label: 'Address Change / Personal Information Update',
    },
    {
      value: 'Plastk Verification',
      label: 'Plastk Verification',
    },
    {
      value: 'View DPID',
      label: 'View DPID',
    },
    {
      value: 'Others',
      label: 'Others',
    },
  ];

  const startTimer = startTime => {
    timer = setInterval(() => {
      const timeDiff = differenceInSeconds(getDateObject(new Date()), getDateObject(startTime));
      const timeLeft = 15 * 60 - timeDiff;
      if (timeLeft <= 0) {
        setState(_ => ({
          ..._,
          can_request_csr: true,
        }));
        setIsAllowed(false);
        setLoading(false);
        clearInterval(timer);
      } else {
        setState(_ => ({
          ..._,
          can_request_csr: false,
          timeLeft: `${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}`,
        }));
      }
    }, 1000);
  };

  useEffect(() => {
    if (
      // !user?.roles?.find(({ type }) => type === 'CSR') ||
      hasPermission('customers.bypass-csr-restrictions')
    ) {
      setIsAllowed(true);
    } else if (customer?.status === 'Funds Requested' && hasPermission('customers.bypass-csr-funds-requested')) {
      setIsAllowed(true);
    } else {
      setLoading(true);
      setState(_ => ({ ..._, rejection_reason: '', requested_time: 0 }));
      notificationService
        .hasPermissionToReadUser({ user_id: customer._id })
        .then(({ notification, message }) => {
          if (message && !notification) {
            throw new Error(message);
          }

          if (notification?.status === 'Approved') {
            setIsAllowed(true);
            startTimer(notification.updated_at);
          } else if (notification?.status === 'Rejected') {
            setState(_ => ({ ..._, rejection_reason: notification.rejection_reason }));
          } else {
            startTimer(notification?.created_at);
          }
          setLoading(false);
        })
        .catch(error => {
          setState(_ => ({ ..._, can_request_csr: true }));
          setIsAllowed(false);
          setLoading(false);
          Toast({
            type: 'error',
            message: error.message,
          });
        });
    }
    return () => {
      clearInterval(timer);
    };
  }, [customer, event]);

  const onSubmitPin = async values => {
    const { dob, pin_code, postal_code } = values;
    try {
      let res;
      if (state.validate === 'ivr') {
        res = await userService.verifyIvr(pin_code, {
          userId: customer?._id,
          page: isApplication ? 'Application' : 'Customer',
          dob,
          postal_code,
        });
      } else {
        res = await userService.verifyOtp(pin_code, {
          dob,
          postal_code,
          userId: customer?._id,
          page: isApplication ? 'Application' : 'Customer',
        });
      }
      if (res.code === 200) {
        await notificationService.sendNotification({
          requested_by: user._id,
          user: customer._id,
          notification_type: 'OTHER_VERIFICATION_METHOD',
          notification_text: `Verified by entring correct ${state.validate.toUpperCase()} pin`,
          status: 'Approved',
        });
        Toast({
          type: 'success',
          message: 'OTP verified successfully',
        });
      } else if (res?.data) {
        // eslint-disable-next-line no-plusplus
        for (let index = 0; index <= res?.data?.length - 1; index++) {
          form.setFieldsError({ [res?.data[index]?.name]: { message: res?.data[index]?.message } });
          Toast({
            type: 'error',
            message: res?.data[index]?.message,
          });
        }
      } else {
        Toast({
          type: 'error',
          message: res?.message,
        });
      }
    } catch (ex) {
      Toast({
        type: 'error',
        message: ex.message,
      });
    }
  };

  const onRequestSupervisor = async reason => {
    try {
      setLoading(true);
      await notificationService.sendNotification({
        requested_by: user._id,
        user: customer._id,
        notification_type: 'SUPERVISOR',
        notification_text: reason,
      });

      Toast({
        type: 'success',
        message: `Sent: ${reason}`,
      });
      setLoading(false);
    } catch (ex) {
      setLoading(false);
      Toast({
        type: 'error',
        message: ex.message,
      });
    }
  };

  const sendOTP = async type => {
    try {
      setLoading(true);
      switch (type) {
        case 'sms':
          await userService.sendPushNotification({
            email: customer.email,
            page: isApplication ? 'Application' : 'Customer',
          });
          break;
        case 'email':
          await userService.sendEmail({
            email: customer.email,
            page: isApplication ? 'Application' : 'Customer',
          });
          break;
        default:
          await userService.sendOtpSMS({
            email: customer?.email,
            first_name: customer?.first_name,
            contact_number: customer?.phone_number,
            page: isApplication ? 'Application' : 'Customer',
          });
          break;
      }
      Toast({
        type: 'success',
        message: `OTP sent successfully`,
      });
      setLoading(false);
    } catch (ex) {
      setLoading(false);
      Toast({
        type: 'error',
        message: ex.message,
      });
    }
  };
  useEffect(() => {
    window.addEventListener('FETCH_NOTIFICATION', () => {
      setEvent(_ => !_);
    });
    return () => {
      window.removeEventListener('FETCH_NOTIFICATION', () => {
        setEvent(_ => !_);
      });
    };
  }, []);

  return (
    <Loaders loading={loading}>
      {isAllowed ? (
        React.cloneElement(children, {
          timeLeft: state.timeLeft,
        })
      ) : (
        <>
          <Grid xs={1} gap={20} css="align-items:end; margin-bottom: var(--gutter);">
            {hasPermission('customers.request-validate') && (
              <>
                <GridCol>
                  <Heading level={3}>Validate</Heading>
                  <Grid xs={2} gap={10}>
                    <Button
                      type={state?.validate === 'ivr' ? 'primary' : 'white'}
                      onClick={() => setState(_ => ({ ..._, validate: 'ivr' }))}>
                      Enter IVR Pin
                    </Button>
                    <Button
                      type={state?.validate === 'otp' ? 'primary' : 'white'}
                      onClick={() => setState(_ => ({ ..._, validate: 'otp' }))}>
                      Enter Otp Code
                    </Button>
                  </Grid>
                </GridCol>
                <GridCol>
                  <Form form={form} onSubmit={onSubmitPin}>
                    <Grid xs={1} md={2} gap={20} css="margin-bottom:20px">
                      <Form.Item
                        label={`${state?.validate === 'ivr' ? 'Enter Ivr Pin' : 'Enter Otp'}`}
                        placeholder={`${state?.validate === 'ivr' ? 'Enter Ivr Pin' : 'Enter Otp'}`}
                        name="pin_code"
                        id="pin_code"
                        type="number"
                        sm
                        noMargin
                        rules={[{ required: true, message: 'Pin Code is required for authentication' }]}>
                        <Field />
                      </Form.Item>
                      <Form.Item
                        sm
                        name="dob"
                        label="Date of Birth"
                        selected={selectedDate}
                        onChange={date => {
                          form.setFieldsValue({ dob: date.target.value ?? '' });
                          setSelectedDate(date.target.value);
                        }}
                        isClearable
                        prefix={<i className="material-icons-outlined">date_range</i>}
                        placeholderText="Select Date Of Birth"
                        type="datepicker"
                        noMargin
                        rules={[{ required: true, message: 'Date Of Birth is required for authentication' }]}>
                        <Field />
                      </Form.Item>
                    </Grid>
                    <Form.Item
                      type="text"
                      label="Postal Code"
                      name="postal_code"
                      placeholder="A4A4A4"
                      rules={[
                        { required: true, message: 'Postal Code is required for authentication' },
                        {
                          pattern: /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]( )?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i,
                          message: 'Postal Code is invalid',
                        },
                      ]}>
                      <Field />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                      Submit
                    </Button>
                  </Form>
                </GridCol>
              </>
            )}
          </Grid>
          <Grid xs={1} md={2} gap={20}>
            {hasPermission('customers.request-supervisor') && (
              <GridCol>
                <Heading level={3}>
                  Request Supervisor{' '}
                  {!state.can_request_csr && (
                    <b
                      css={`
                        color: red;
                      `}>
                      (wait {state.timeLeft} )
                    </b>
                  )}
                </Heading>
                <Select
                  isDisabled={!state.can_request_csr}
                  options={reqSupervisorOptions}
                  sm
                  placeholder="Select a Reason"
                  noMargin
                  onChange={({
                    target: {
                      value: { value },
                    },
                  }) => onRequestSupervisor(value)}
                />
              </GridCol>
            )}
            {hasPermission('customers.send-otp-via-code') && (
              <GridCol>
                <Heading level={3}>Send OTP Code via</Heading>
                <Grid xs={3} gap={10}>
                  <Button type="white" onClick={() => sendOTP('push')}>
                    Push Notification
                  </Button>
                  <Button type="white" onClick={() => sendOTP('sms')}>
                    SMS
                  </Button>
                  <Button type="white" onClick={() => sendOTP('email')}>
                    Email
                  </Button>
                </Grid>
              </GridCol>
            )}
          </Grid>
        </>
      )}
    </Loaders>
  );
}
