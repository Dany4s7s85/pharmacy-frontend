import React, { useContext, useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import { AuthContext } from 'context/authContext';
import Button from 'components/atoms/Button';
import Grid from 'components/atoms/Grid';
import Field from 'components/molecules/Field';
import Form, { useForm } from 'components/molecules/Form';
import Toast from 'components/molecules/Toast';
import CategoryService from 'services/categoryService';
import Select from 'components/atoms/Select';
import Loaders from 'components/atoms/Loaders';

function SubCategoryFrom({ category, onClose = () => {} }) {
  const [form] = useForm();
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(false);
  const { refetch } = useContext(AuthContext);
  const { categories_data, categories_loading } = CategoryService.GetCategories();
  useEffect(() => {
    if (category) {
      form.setFieldsValue({
        sub_category_name: category.sub_category_name,
      });
      setState({
        ...state,
        sub_category_name: category.sub_category_name,
      });
    }
  }, [category]);

  const onSubmit = async data => {
    try {
      setLoading(true);
      if (category) await CategoryService.updateBusinessSubCategory(category._id, data);
      else await CategoryService.createBusinessSubCategory({ ...data, parent_category: data.parent_category.value });
      refetch();
      onClose();
      setLoading(false);
      Toast({
        type: 'success',
        message: 'Category Updated successfully',
      });
    } catch (ex) {
      setLoading(false);
      Toast({
        type: 'error',
        message: ex.message,
      });
    }
  };

  return (
    <Loaders loading={categories_loading}>
      <Form form={form} onSubmit={onSubmit} onTouched={_ => setState(__ => ({ ...__, ..._ }))}>
        <Grid
          xs={1}
          lg={2}
          colGap={20}
          css={`
            align-items: center;
          `}>
          <Form.Item
            sm
            type="text"
            label="Sub Category Name"
            name="sub_category_name"
            placeholder="Sub Category Name"
            rules={[
              { required: true, message: 'Please enter sub category name' },
              { pattern: /^[A-Za-z0-9\s&]*$/, message: "Only Alphabets and '&' sign is allowed" },
              { pattern: /^.{3,40}$/, message: 'Maximum Character Length is 40 And Minimum Character Length is 3' },
            ]}>
            <Field />
          </Form.Item>
          {!category && (
            <Form.Item
              sm
              type="text"
              allowSearch
              label="Parent Category"
              name="parent_category"
              placeholder="Parent Category"
              rules={[{ required: true, message: 'Please select parent category' }]}
              options={categories_data.map(x => ({ label: x.category_name, value: x._id }))}>
              <Select />
            </Form.Item>
          )}
        </Grid>
        <Button loading={loading} type="primary" htmlType="submit">
          Save
        </Button>
      </Form>
    </Loaders>
  );
}

export default SubCategoryFrom;
