import React, { useContext, useState, useEffect } from 'react';
import Slugify from 'slugify';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import Loaders from 'components/atoms/Loaders';
import Editor from 'components/molecules/Editor';
import Field from 'components/molecules/Field';
import Form, { useForm } from 'components/molecules/Form';
import Toast from 'components/molecules/Toast';
import Button from '../../atoms/Button';
import Grid from '../../atoms/Grid';
import cmsService from '../../../services/cmsService';

import { AuthContext } from '../../../context/authContext';

export default function CmsForm({ onClose, cmsElement }) {
  const [form] = useForm();
  const [state, setState] = useState({
    pageTitle: '',
    description: '',
    htmlContent: '',
    slug: '',
    meta: '',
    customSlug: '',
  });
  const [loading, setLoading] = useState(false);
  const { refetch } = useContext(AuthContext);

  const { htmlContent } = state;

  useEffect(() => {
    if (cmsElement) {
      form.setFieldsValue({
        pageTitle: cmsElement?.pageTitle,
        description: cmsElement?.description,
        htmlContent: cmsElement?.htmlContent,
        slug: cmsElement?.slug,
        meta: cmsElement?.meta,
      });
      setState({
        pageTitle: cmsElement?.pageTitle,
        description: cmsElement?.description,
        htmlContent: cmsElement?.htmlContent,
        slug: cmsElement?.slug,
        meta: cmsElement?.meta,
      });
    }
  }, [cmsElement]);

  const onSubmit = async data => {
    try {
      setLoading(true);
      let response;
      if (cmsElement) {
        // edit cms
        response = await cmsService?.updateContents(cmsElement._id, {
          pageTitle: data.pageTitle.toLowerCase(),
          htmlContent: htmlContent === '<p><br></p>' ? '' : htmlContent,
          slug: data.customSlug && data.customSlug.length > 0 ? data.customSlug : data.slug,
          description: data.description,
          meta: data.meta,
        });
        if (response?.code === 200) {
          Toast({
            type: 'success',
            message: 'Cms updated successfully',
          });
        } else {
          Toast({
            type: 'error',
            message: response?.message,
          });
        }
      } else {
        response = await cmsService?.createContents({
          pageTitle: data.pageTitle.toLowerCase(),
          htmlContent: htmlContent === '<p><br></p>' ? '' : htmlContent,
          slug: data.customSlug && data.customSlug.length > 0 ? data.customSlug : data.slug,
          description: data.description,
          meta: data.meta,
        });
        if (response?.code) {
          Toast({
            type: 'success',
            message: 'Cms created successfully',
          });
        } else {
          Toast({
            type: 'error',
            message: response?.message,
          });
        }
      }
    } catch (ex) {
      setLoading(false);
      Toast({
        type: 'error',
        message: ex?.message,
      });
    } finally {
      refetch();
      onClose();
      setLoading(false);
    }
  };
  const onBlurHandler = e => {
    const slugString = Slugify(e.target.value, {
      replacement: '-', // replace spaces with replacement character, defaults to `-`
      remove: /[*+~.()'"!:@%]/g, // remove characters that match regex, defaults to `undefined`
      lower: true, // convert to lower case, defaults to `false`
      strict: false, // strip special characters except replacement, defaults to `false`
      locale: 'vi', // language code of the locale to use
    });
    form.setFieldsValue({ slug: slugString });
    setState(prev => ({ ...prev, slug: slugString }));
  };
  const onEditorChange = html => {
    setState(prev => ({ ...prev, htmlContent: html }));
  };
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
              type="text"
              label="Page Title"
              name="pageTitle"
              placeholder="pageTitle"
              rules={[
                { required: true, message: 'Please enter page title' },
                {
                  pattern: /[a-zA-Z0-9]*s*[a-zA-Z0-9]$/,
                  message: 'Please enter a valid page title',
                },
                {
                  pattern: /^.{3,}$/,
                  message: 'Page Title must be minimum 3 characters.',
                },
                {
                  pattern: /^.{3,40}$/,
                  message: 'Page Title must be maximum 40 characters.',
                },
              ]}>
              <Field onBlur={onBlurHandler} />
            </Form.Item>
            <Form.Item sm disabled type="text" label="Slug" name="slug" placeholder="Slug" value={state?.slug}>
              <Field />
            </Form.Item>
            <Form.Item
              type="text"
              label="Custom Slug"
              name="customSlug"
              placeholder="customSlug"
              rules={[{ pattern: /^.{0,40}$/, message: 'Maximum Character Length Is 40' }]}>
              <Field />
            </Form.Item>
            <Form.Item
              type="text"
              label="Description"
              name="description"
              placeholder="description"
              rules={[
                {
                  required: true,
                  message: 'Please enter your description',
                },
                {
                  pattern: /^.{3,}$/,
                  message: 'Description must be minimum 3 characters.',
                },
                {
                  pattern: /^.{3,40}$/,
                  message: 'Description must be maximum 40 characters.',
                },
              ]}>
              <Field />
            </Form.Item>
            <Form.Item
              sm
              name="meta"
              label="meta"
              placeholder="meta"
              rules={[
                {
                  required: true,
                  message: 'Please enter meta',
                },
                {
                  pattern: /^.{3,}$/,
                  message: 'meta must be minimum 3 characters.',
                },
                {
                  pattern: /^.{3,40}$/,
                  message: 'meta must be maximum 40 characters.',
                },
              ]}>
              <Field />
            </Form.Item>
          </Grid>
          <Form.Item name="htmlContent" placeholder="htmlContent">
            <Editor required htmlContent={state.htmlContent} onEditorChange={onEditorChange} />
          </Form.Item>

          <Button loading={loading} type="primary" htmlType="submit" css="margin-top: 20px;">
            Save
          </Button>
        </Form>
      </Loaders>
    </>
  );
}
