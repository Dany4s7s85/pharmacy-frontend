/* eslint-disable jsx-a11y/no-onchange */
import React from 'react';

// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import { useMediaPredicate } from 'react-media-hook';
import { StyledTableHeader, TotalResult, ResultPerPage, StyledSelect } from './TableHeader.styles';

function TableHeader({ exportBtn, total, resultPerPage, setPageSize, page }) {
  const MinWidth992 = useMediaPredicate('(min-width: 992px)');
  const resultPerPageOptions = [
    { value: '10', label: '10' },
    { value: '20', label: '20' },
    { value: '50', label: '50' },
    { value: '100', label: '100' },
  ];

  return (
    <StyledTableHeader>
      <TotalResult>
        {MinWidth992 && 'Showing'} {page * resultPerPage - resultPerPage + 1} -{' '}
        {total <= resultPerPage ? total : page * resultPerPage} of {total} results
      </TotalResult>

      <ResultPerPage>
        {exportBtn ?? null}
        <span css="margin-left: 15px;">Result per page: </span>
        <StyledSelect
          onChange={({
            target: {
              value: { value },
            },
          }) => setPageSize(value)}
          isSearchable={false}
          options={resultPerPageOptions}
          defaultValue={resultPerPageOptions[0]}
          sm
          noMargin
          css="padding:0;"
        />
      </ResultPerPage>
    </StyledTableHeader>
  );
}

export default TableHeader;
