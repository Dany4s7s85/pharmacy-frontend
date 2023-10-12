import React, { useMemo, useState, useContext } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import faqService from 'services/faqService';
import data from 'helpers/faq.json';
import Table from 'components/molecules/Table';
import { AuthContext } from 'context/authContext';

import Toast from 'components/molecules/Toast';
import Button from 'components/atoms/Button';

function FaqsRestore({ onClose = () => {} }) {
  const [loading, setLoading] = useState(false);
  const { refetch } = useContext(AuthContext);
  const onSubmit = async () => {
    try {
      setLoading(true);
      await faqService.restoreFaqs(data);
      Toast({
        message: 'Faqs Restored successfully',
        type: 'success',
      });
      refetch();
      onClose();
    } catch (ex) {
      Toast({
        type: 'error',
        message: ex?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const columnNames = [`Categories`, `Questions`, 'Answers'];
  const { faqs_rows } = useMemo(
    () => ({
      faqs_rows: data.map(_ => [
        _?.category ?? '--------',
        _?.question ?? '--------',
        `${_?.answer.slice(0, 30)}.....` ?? '--------',
      ]),
    }),
    [data],
  );
  return (
    <>
      <Table width={1200} height={600} rowsData={faqs_rows} columnNames={columnNames} noPadding />

      <Button loading={loading} type="primary" onClick={onSubmit} css="margin-top: 20px;">
        Save
      </Button>
    </>
  );
}

export default FaqsRestore;
