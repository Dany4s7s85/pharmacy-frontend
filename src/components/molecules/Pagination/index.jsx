/* eslint-disable radix */
import React, { useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import style from 'styled-components/macro';

import UsePagination from 'components/atoms/UsePagination';
import Input from 'components/atoms/Input';
import Tooltip from 'components/atoms/Tooltip';
import { PaginationList, PaginationButton } from './Pagination.styles';

function Pagination(props) {
  const { onPageChange, totalCount, siblingCount = 1, currentPage, pageSize, customCss } = props;

  const [inputCurrentPage, setInputCurrentPage] = useState(1);
  const [error, setError] = useState(false);

  const paginationRange = UsePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });
  useEffect(() => {
    setInputCurrentPage(currentPage);
  }, [currentPage]);
  const onNext = () => {
    onPageChange(currentPage + 1);
    setInputCurrentPage(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
    setInputCurrentPage(currentPage - 1);
  };

  const onKeyPress = event => {
    const { key } = event;
    if (key === 'Enter' && inputCurrentPage > 0 && inputCurrentPage <= Math.ceil(totalCount / pageSize)) {
      setInputCurrentPage(inputCurrentPage);
      onPageChange(inputCurrentPage);
    }
  };
  const lastPage = paginationRange[paginationRange?.length - 1];
  return (
    <PaginationList css={customCss}>
      <PaginationButton
        unStyled
        type="primary"
        onClick={onPrevious}
        disabled={currentPage <= 1}
        size={28}
        css="margin-right: 12px;">
        <i className="material-icons-outlined">chevron_left</i> PREVIOUS
      </PaginationButton>
      <span>
        <Tooltip title={error ? 'Invalid Page Number' : 'Enter Page Number'} type={error ? 'error' : 'dark'}>
          <Input
            type="number"
            value={inputCurrentPage}
            onKeyPress={onKeyPress}
            onChange={event => {
              if (!(+event.target.value > 0 && +event.target.value <= Math.ceil(totalCount / pageSize))) {
                setError(true);
              } else {
                setError(false);
              }
              setInputCurrentPage(parseInt(event.target.value));
            }}
            sm
            css={`
              height: 35px;
              width: 35px;
              padding: 5px;
              text-align: center;
              ${error && 'border-color: var(--danger) !important'}
            `}
          />
        </Tooltip>
        <span css="color: var(--gray); font-size: var(--font-size-sm)"> out of</span>
      </span>
      {paginationRange?.map(
        (pageNumber, index, arr) =>
          arr.length - 1 === index && (
            <span key={index} css="margin-left: 5px;">
              {pageNumber}
            </span>
          ),
      )}
      <PaginationButton
        unStyled
        type="primary"
        onClick={onNext}
        disabled={currentPage >= lastPage}
        size={28}
        css="margin-left: 12px;">
        NEXT <i className="material-icons-outlined">chevron_right</i>
      </PaginationButton>
    </PaginationList>
  );
}

export default Pagination;
