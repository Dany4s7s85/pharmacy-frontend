import React, { useState, useEffect, useContext } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import Button from 'components/atoms/Button';
import Icon from 'components/atoms/Icon';
import faqService from 'services/faqService';
import { AuthContext } from 'context/authContext';
import Field from 'components/molecules/Field';
import Form, { useForm } from 'components/molecules/Form';
import Editor from 'components/molecules/Editor';
import Toast from 'components/molecules/Toast';

function FaqForm({ faqData, onClose = () => {} }) {
  const [form] = useForm();
  const [state, setState] = useState({
    category: '',
    question: '',
    htmlContent: '',
  });

  const [loading, setLoading] = useState(false);
  const { htmlContent } = state;
  const { refetch } = useContext(AuthContext);
  useEffect(() => {
    if (faqData) {
      form.setFieldsValue({
        category: faqData?.category,
        question: faqData?.question,
        htmlContent: faqData?.answer,
      });
      setState({
        category: faqData?.category,
        question: faqData?.question,
        htmlContent: faqData?.answer,
      });
    }
  }, [faqData]);

  const onSubmit = async data => {
    try {
      setLoading(true);
      if (faqData) {
        await faqService.updateContents(faqData?._id, {
          category: data.category,
          question: data.question,
          answer: htmlContent === '<p><br><br/></p>' ? '' : htmlContent,
        });
      } else {
        await faqService.createContents({
          category: data.category,
          question: data.question,
          answer: htmlContent === '<p><br><br/></p>' ? '' : htmlContent,
        });
      }
      refetch();
      onClose();
      setLoading(false);
      Toast({
        type: 'success',
        message: 'Faq saved successfully',
      });
    } catch (ex) {
      setLoading(false);
      Toast({
        type: 'error',
        message: ex?.message,
      });
    }
  };
  const onEditorChange = html => {
    setState(prev => ({ ...prev, htmlContent: html }));
  };

  return (
    <Form form={form} onSubmit={onSubmit}>
      <Form.Item
        sm
        type="text"
        label="Category"
        labelIcon={<Icon size="1rem" showTooltip toolTipContent="Enter FAQ's category" className="icon-help-circle" />}
        name="category"
        placeholder="category"
        rules={[
          { required: true, message: 'Category is required' },
          {
            pattern: /^.{5,}$/,
            message: 'Category must be minimum 5 characters.',
          },
          {
            pattern: /^.{5,80}$/,
            message: 'Category must be maximum 80 characters.',
          },
        ]}>
        <Field />
      </Form.Item>
      <Form.Item
        sm
        type="text"
        label="Question"
        labelIcon={<Icon size="1rem" showTooltip toolTipContent="Enter your question" className="icon-help-circle" />}
        name="question"
        placeholder="Question"
        rules={[
          { required: true, message: 'Question is required' },
          {
            pattern: /^.{5,}$/,
            message: 'Question must be minimum 5 characters.',
          },
          {
            pattern: /^.{5,80}$/,
            message: 'Question must be maximum 80 characters.',
          },
        ]}>
        <Field />
      </Form.Item>
      <Form.Item
        sm
        type="text"
        label="Answer"
        labelIcon={<Icon size="1rem" showTooltip toolTipContent="Enter FAQ's answer" className="icon-help-circle" />}
        name="htmlContent"
        placeholder="Answer"
        rules={[{ required: true, message: 'Answer is required' }]}>
        <Editor required title="Answer" htmlContent={state.htmlContent} onEditorChange={onEditorChange} />
      </Form.Item>

      <Button loading={loading} type="primary" htmlType="submit" css="margin-top: var(--gutter);">
        Save
      </Button>
    </Form>
  );
}

export default FaqForm;
