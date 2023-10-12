import React from 'react';
import Pagination from '../../molecules/Pagination';
import TableHeader from '../TableHeader';
import Filters from '../../../common/filters';
import { StyledTableLayout } from './TableLayout.styles';

function TableLayout({
  children,
  currentPage = 1,
  pageSize = 10,
  totalCount = 0,
  onChangeFilters,
  customFilterKey = '',
  exportBtn,
  extraFilters,
  filters = true,
  noNegativeMargin,
}) {
  return (
    <>
      {filters && (
        <Filters
          onChangeFilters={_ => onChangeFilters({ ..._, page: 1 })}
          customFilterKey={customFilterKey}
          extraFilters={extraFilters}
        />
      )}
      <StyledTableLayout noNegativeMargin={noNegativeMargin}>
        <TableHeader
          total={totalCount}
          page={currentPage}
          resultPerPage={pageSize}
          setPageSize={_ => onChangeFilters({ pageSize: _, page: 1 })}
          exportBtn={exportBtn}
        />
        {children}
        <Pagination
          className="pagination-bar"
          currentPage={currentPage}
          totalCount={totalCount}
          pageSize={pageSize}
          onPageChange={_ => onChangeFilters({ page: _ })}
        />
      </StyledTableLayout>
    </>
  );
}

export default TableLayout;
