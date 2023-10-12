/* eslint-disable no-param-reassign */
import React, { useState, useEffect, useContext } from 'react';
import Button from 'components/atoms/Button';
import Grid from 'components/atoms/Grid';
import SubTitle from 'components/atoms/SubTitle';
import Select from 'components/atoms/Select';
import cardService from 'services/cardService';
import Form, { useForm } from 'components/molecules/Form';
import Toast from 'components/molecules/Toast';
import Field from 'components/molecules/Field';
import embossList from '../../../helpers/embossList';
import { AuthContext } from '../../../context/authContext';

function CustomerForm({ customer, onClose = () => {}, timeLeft }) {
  const [form] = useForm();
  const [embossOptions, setEmbossOptions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [state, setState] = useState({});
  const { refetch } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [issueReason, setIssueReason] = useState([]);

  const issuingReason = async () => {
    try {
      const res = await cardService.issuingReason();

      if (res) {
        const items = res?.data?.Item;
        const new_items = items?.slice();
        new_items?.push({ Id: 12345, Code: 'CardIssuingReasonType', Value: 'Z', Description: 'Plastk Reasons' });
        // setIssueReason(new_items);
        const options = new_items;
        options.forEach((opt, index) => {
          options[index] = { value: opt.Id, label: opt.Description };
        });
        setIssueReason(() => options);
      }
    } catch (ex) {
      Toast({
        type: 'error',
        message: ex?.message,
      });
    }
  };

  useEffect(() => {
    issuingReason();
  }, []);

  const getEmbossOptions = (first_name, middle_name, last_name) => {
    const options = embossList(first_name, middle_name, last_name);
    options.forEach((opt, index) => {
      options[index] = { value: opt, label: opt };
    });
    setEmbossOptions(() => options);
  };
  const CardTypes = [{ value: '1', label: 'Original Plastk Card' }];

  const onSubmit = async data => {
    try {
      if (data.issuing_reason.label === 'Plastk Reasons') {
        await cardService
          .pendingCardRequest(
            selectedCustomer._id,
            selectedCustomer.customer_number,
            selectedCustomer.card_id,
            data.issuing_reason.value,
            data.card_type.value,
            data.emboss.value,
            data.issuing_reason.label,
            data.notes,
          )
          .then(res => {
            if (res.success) {
              refetch();
              onClose();
              Toast({
                type: 'success',
                message: res.message,
              });
            } else {
              refetch();
              onClose();
              Toast({
                type: 'failure',
                message: res.message,
              });
            }
          });
      } else {
        await cardService
          .replaceCard(
            selectedCustomer._id,
            selectedCustomer.customer_number,
            selectedCustomer.card_id,
            data.issuing_reason.value,
            data.card_type.value,
            data.emboss.value,
            data.issuing_reason.label,
            data.notes,
          )
          .then(res => {
            if (res.success) {
              refetch();
              onClose();
              Toast({
                type: 'success',
                message: res.message,
              });
            } else {
              refetch();
              onClose();
              Toast({
                type: 'failure',
                message: res.message,
              });
            }
          });
      }
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
    if (customer) {
      const customer_temp = {
        customer_number: customer.customer_number,
        _id: customer._id,
        card_id: customer.card_id,
        card_type: { value: '1', label: 'Original Plastk Card' },
        emboss: { value: customer.emboss, label: customer.emboss },
      };
      setSelectedCustomer(customer_temp);
      form.setFieldsValue(customer_temp);
      getEmbossOptions(customer?.first_name, customer?.middle_name, customer?.last_name);
    }
  }, [customer]);

  return (
    <>
      {timeLeft && (
        <div
          css={`
            color: red;
            float: right;
          `}>
          Remaining Time : {timeLeft}
        </div>
      )}
      <Form
        form={form}
        initialValues={selectedCustomer}
        onSubmit={onSubmit}
        onTouched={_ => {
          setState(__ => ({ ...__, ..._ }));
        }}>
        <SubTitle>Card Replacement</SubTitle>
        <Grid xs={1} lg={2} colGap={20}>
          <Form.Item sm label="Customer Number" placeholder="Customer Number" name="customer_number" disabled>
            <Field />
          </Form.Item>
          <Form.Item sm label="Card Id" placeholder="Card Id" name="card_id" disabled>
            <Field />
          </Form.Item>
        </Grid>
        <Grid xs={1} lg={2} colGap={20}>
          <Form.Item
            id="dropdown"
            options={CardTypes}
            isSearchable
            label="Card Type"
            placeholder="Card Type"
            name="card_type"
            isDisabled>
            <Select sm />
          </Form.Item>
          <Form.Item
            sm
            options={embossOptions}
            name="emboss"
            label="Emboss"
            disabled
            placeholder="Select Emboss Name"
            rules={[
              {
                required: true,
                message: 'Name that should be on the card should be selected',
              },
            ]}>
            <Select />
          </Form.Item>
        </Grid>
        <Form.Item
          id="dropdown"
          options={issueReason}
          isSearchable
          label="Issuing Reason"
          placeholder="Issue reason"
          name="issuing_reason">
          <Select sm />
        </Form.Item>
        <Form.Item sm label="Notes" placeholder="write notes" name="notes">
          <Field />
        </Form.Item>

        <Button loading={loading} type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </>
  );
}

export default CustomerForm;
