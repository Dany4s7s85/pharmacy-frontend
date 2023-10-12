import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import Toast from 'components/molecules/Toast';
import GridCol from 'components/atoms/GridCol';
import Heading from 'components/atoms/Heading';
import ImgPreview from 'components/molecules/ImgPreview';
import Grid from 'components/atoms/Grid';
import userService from 'services/userService';
import Loaders from 'components/atoms/Loaders';
import { PreviousDocsWrap, OtherDocsWrap, NoRecordFound } from './GetUserAdditionalDocs.styles';

export default function GetUserAdditionalDocs({ customerId }) {
  const [fetch, setFetch] = useState(true);

  const refetch = () => setFetch(_ => !_);

  const { additonalDoc_loading, additonalDoc_data } = userService.GetAdditionalDocs(customerId, fetch);

  const handleDelete = async (url, docType) => {
    try {
      const response = await userService.deleteDocument(customerId, url, docType);
      if (response?.success) {
        Toast({ type: 'success', message: response?.message });
        refetch();
      }
    } catch (ex) {
      Toast({ type: 'error', message: ex?.message });
    }
  };

  return (
    <>
      <Loaders loading={additonalDoc_loading}>
        {additonalDoc_data ? (
          <>
            <Heading level={2} css="font-weight: 500;">
              Latest Documents
            </Heading>
            <Grid gap={30} lg={3}>
              {additonalDoc_data?.marriage_certificate?.length > 0 && (
                <GridCol>
                  <Heading level={3}>Marriage Certificate</Heading>
                  <ImgPreview
                    src={additonalDoc_data?.marriage_certificate[0]?.imageUrl}
                    pdf={additonalDoc_data?.marriage_certificate[0]?.imageUrl?.includes('pdf')}
                  />
                </GridCol>
              )}
              {additonalDoc_data?.birth_certificate?.length > 0 && (
                <GridCol>
                  <Heading level={3}>Birth Certificate</Heading>
                  <ImgPreview
                    src={additonalDoc_data?.birth_certificate[0]?.imageUrl}
                    pdf={additonalDoc_data?.birth_certificate[0]?.imageUrl?.includes('pdf')}
                  />
                </GridCol>
              )}
              {additonalDoc_data?.sin_document?.length > 0 && (
                <GridCol>
                  <Heading level={3}>SIN Document</Heading>
                  <ImgPreview
                    src={additonalDoc_data?.sin_document[0]?.imageUrl}
                    pdf={additonalDoc_data?.sin_document[0]?.imageUrl?.includes('pdf')}
                  />
                </GridCol>
              )}
            </Grid>
            <Heading level={2} css="font-weight: 500;margin-top: 20px">
              Previous Documents
            </Heading>
            {additonalDoc_data?.marriage_certificate?.length > 0 && (
              <>
                <Heading level={3}>Previous Marriage Certificates</Heading>
                <PreviousDocsWrap gap={30} lg={3}>
                  {additonalDoc_data?.marriage_certificate?.length > 1 ? (
                    additonalDoc_data?.marriage_certificate?.slice(1).map(item => (
                      <GridCol>
                        <ImgPreview
                          onDelete={() => handleDelete(item.imageUrl, 'marriage')}
                          src={item.imageUrl}
                          pdf={item?.imageUrl?.includes('pdf')}
                          withDelete
                        />
                      </GridCol>
                    ))
                  ) : (
                    <NoRecordFound>No Previous Record Found</NoRecordFound>
                  )}
                </PreviousDocsWrap>
              </>
            )}
            {additonalDoc_data?.birth_certificate?.length > 0 && (
              <>
                <Heading level={3} css="margin-top: 20px">
                  Previous Birth Certificates
                </Heading>
                <PreviousDocsWrap gap={30} lg={3}>
                  {additonalDoc_data?.birth_certificate?.length > 1 ? (
                    additonalDoc_data?.birth_certificate?.slice(1).map(item => (
                      <GridCol>
                        <ImgPreview
                          onDelete={() => handleDelete(item.imageUrl, 'birth')}
                          src={item.imageUrl}
                          pdf={item?.imageUrl?.includes('pdf')}
                          withDelete
                        />
                      </GridCol>
                    ))
                  ) : (
                    <NoRecordFound>No Previous Record Found</NoRecordFound>
                  )}
                </PreviousDocsWrap>
              </>
            )}
            {additonalDoc_data?.sin_document?.length > 0 && (
              <>
                <Heading level={3} css="margin-top: 20px">
                  Previous SIN Documents
                </Heading>
                <PreviousDocsWrap gap={30} lg={3}>
                  {additonalDoc_data?.sin_document?.length > 1 ? (
                    additonalDoc_data?.sin_document?.slice(1).map(item => (
                      <GridCol>
                        <ImgPreview
                          onDelete={() => handleDelete(item.imageUrl, 'sin')}
                          src={item.imageUrl}
                          pdf={item?.imageUrl?.includes('pdf')}
                          withDelete
                        />
                      </GridCol>
                    ))
                  ) : (
                    <NoRecordFound>No Previous Record Found</NoRecordFound>
                  )}
                </PreviousDocsWrap>
              </>
            )}
            <Heading level={2} css="font-weight: 500;margin-top: 20px">
              Other Documents
            </Heading>
            <OtherDocsWrap gap={30} lg={3}>
              {additonalDoc_data?.other_document?.length > 0 ? (
                additonalDoc_data?.other_document.map(item => (
                  <GridCol>
                    <Heading level={3}>{item?.title}</Heading>
                    <ImgPreview
                      onDelete={() => handleDelete(item.imageUrl, 'other')}
                      src={item?.imageUrl}
                      pdf={item?.imageUrl?.includes('pdf')}
                      withDelete
                    />
                  </GridCol>
                ))
              ) : (
                <NoRecordFound>No Record Found</NoRecordFound>
              )}
            </OtherDocsWrap>
          </>
        ) : (
          <NoRecordFound>No Record Found</NoRecordFound>
        )}
      </Loaders>
    </>
  );
}
