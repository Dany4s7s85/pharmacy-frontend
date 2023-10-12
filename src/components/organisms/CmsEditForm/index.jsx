import React, { useState, useEffect, useContext } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import Button from 'components/atoms/Button';
import Form, { useForm } from 'components/molecules/Form';
import Grid from 'components/atoms/Grid';
import GridCol from 'components/atoms/GridCol';
import Toast from 'components/molecules/Toast';
import cmsService from 'services/cmsService';
import Field from 'components/molecules/Field';
import Select from 'components/atoms/Select';

import { AuthContext } from 'context/authContext';

function CmsEditForm({ item, onClose, category, levelVal }) {
  const { refetch } = useContext(AuthContext);

  const [formEdit] = useForm();
  const [addMoreCnt, setAddMoreCnt] = useState([]);

  const submitSubCategories = async e => {
    const values = { ...e, edit_permission: e.edit_permission.value, view_permission: e.view_permission.value };
    const payload = {
      categoryId: category._id,
      formData: values,
      subCategoryId: item?._id,
    };

    try {
      const res = await cmsService.editSubCategory(payload);
      if (res) {
        if (res?.success) {
          Toast({ type: 'success', message: 'Parameter added Successfully' });
        }
      }
    } catch (error) {
      Toast({ type: 'error', message: error?.message });
    } finally {
      onClose();
      refetch();
    }
  };

  useEffect(() => {
    const initialValueSet = {};
    item.values.forEach(val => {
      const { _id, value } = val;
      initialValueSet[`value${_id}`] = value;
    });

    formEdit.setFieldsValue({
      title: item.title,
      view_permission: { value: item.view_permission, label: item.view_permission },
      edit_permission: { value: item.edit_permission, label: item.edit_permission },
    });
    formEdit.setFieldsValue(initialValueSet);
  }, [item]);

  return (
    <Form form={formEdit} onSubmit={submitSubCategories}>
      <Grid xs={1} sm={2} colGap={20}>
        <GridCol>
          <Form.Item
            sm
            type="text"
            label="Title"
            name="title"
            placeholder="Enter Title"
            rules={[{ pattern: /^.{0,40}$/, message: 'Maximum Character Length is 40' }]}>
            <Field />
          </Form.Item>
        </GridCol>
        <GridCol>
          <Form.Item
            id="dropdown"
            sm
            options={levelVal}
            isSearchable
            label="System Configuration - View"
            name="view_permission">
            <Select />
          </Form.Item>
        </GridCol>
        <GridCol>
          <Form.Item
            id="dropdown"
            sm
            options={levelVal}
            isSearchable
            label="System Configuration - Edit"
            name="edit_permission">
            <Select />
          </Form.Item>
        </GridCol>

        {item?.values?.map(v => (
          <GridCol>
            <Form.Item
              sm
              type="number"
              label="Value"
              name={`value${v._id}`}
              rules={[{ pattern: /^.{0,40}$/, message: 'Maximum Character Length is 40' }]}>
              <Field />
            </Form.Item>
          </GridCol>
        ))}

        {addMoreCnt.map((i, ind) => (
          <GridCol lg={2} name={i}>
            <Form.Item
              button={
                <Button
                  size={30}
                  type="danger"
                  shape="circle"
                  onClick={() => setAddMoreCnt(addMoreCnt.filter(ii => ii !== i))}>
                  <i className="material-icons-outlined">delete</i>
                </Button>
              }
              sm
              type="number"
              label={`New Value ${Number(ind + 1)}`}
              name={`valueNew${i}`}
              rules={[
                { required: addMoreCnt.length > 0, message: 'This field is required' },
                { pattern: /^.{0,40}$/, message: 'Maximum Character Length is 40' },
              ]}>
              <Field />
            </Form.Item>
          </GridCol>
        ))}
        <GridCol lg={2}>
          <div
            css={`
              display: flex;
              justify-content: flex-end;
            `}>
            <Button
              type="white"
              onClick={() => {
                setAddMoreCnt(orA => [...orA, Math.floor(Math.random() * 10 ** 4)]);
              }}
              width={120}
              prefix={<i className="material-icons-outlined">add</i>}
              css="margin: 0 auto 26px;">
              Add More
            </Button>
          </div>
        </GridCol>
        <GridCol lg={2}>
          <div
            css={`
              display: flex;
              justify-content: flex-end;
              gap: 20px;
            `}>
            <Button
              type="outline"
              onClick={() => {
                // formEdit.resetFields();
                onClose();
              }}
              width={120}>
              cancel
            </Button>
            <Button type="primary" width={120} htmlType="submit">
              Submit
            </Button>
          </div>
        </GridCol>
      </Grid>
    </Form>
  );
}

export default CmsEditForm;
