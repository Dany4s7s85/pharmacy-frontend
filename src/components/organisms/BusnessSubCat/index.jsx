import React, { useState, useMemo, useEffect, useContext } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import { format } from 'date-fns';
import { ActionBtnHolder } from 'styles/helpers.styles';
import ConfirmationModal from 'components/molecules/ConfirmationModal';
import Button from 'components/atoms/Button';
import Tooltip from 'components/atoms/Tooltip';
import ModalContainer from 'components/molecules/ModalContainer';
import Toast from 'components/molecules/Toast';
import { getDateObject } from 'helpers/common';
import TableLayout from 'components/atoms/TableLayout';
import Table from 'components/molecules/Table';
import CategoryService from 'services/categoryService';
import { AuthContext } from 'context/authContext';
import SubCategoryFrom from '../SubCategoryForm';

export default function BusinessSubCategories({ categories }) {
  const [paginatedCategories, setPaginatedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState({
    page: 1,
    pageSize: 10,
    searchText: '',
    startDate: '',
    endDate: '',
  });
  const paginateSearch = (array, page_size, page_number, searchText, startDate, endDate) =>
    startDate !== '' && endDate !== ''
      ? array
          .filter(
            ({ created_at }) =>
              new Date(created_at).toISOString() >= new Date(startDate).toISOString() &&
              new Date(created_at).toISOString() <= new Date(endDate).toISOString(),
          )
          .filter(({ sub_category_name }) => sub_category_name.match(new RegExp(searchText, 'i')))
          .slice((page_number - 1) * page_size, page_number * page_size)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      : array
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .filter(({ sub_category_name }) => sub_category_name.match(new RegExp(searchText, 'i')))
          .slice((page_number - 1) * page_size, page_number * page_size);
  const { refetch, hasPermission } = useContext(AuthContext);
  useEffect(() => {
    setPaginatedCategories(
      paginateSearch(
        categories,
        searchQuery.pageSize,
        searchQuery.page,
        searchQuery.searchText,
        searchQuery.startDate,
        searchQuery.endDate,
      ),
    );
  }, [
    searchQuery.page,
    searchQuery.pageSize,
    searchQuery.searchText,
    categories,
    searchQuery.startDate,
    searchQuery.endDate,
  ]);

  const onDeleteSubCategory = async id => {
    try {
      await CategoryService.deleteBusinessSubCategory(id);
      refetch();
      Toast({
        message: 'Category deleted successfully',
        type: 'success',
      });
    } catch (ex) {
      Toast({
        type: 'error',
        message: ex?.message,
      });
    }
  };

  const actionBtns = _ => (
    <ActionBtnHolder>
      {hasPermission('business-categories.delete-sub-category') && (
        <ConfirmationModal
          title="Are you sure you want to delete this record?"
          subtitle="you can't undo this action"
          deleteModal
          onOk={() => onDeleteSubCategory(_._id)}
          btnComponent={({ onClick }) => (
            <Tooltip title="Delete" type="dark">
              <Button unStyled size={20} className="delete-btn" onClick={onClick}>
                <i className="material-icons-outlined">delete_forever</i>
              </Button>
            </Tooltip>
          )}
        />
      )}
      {hasPermission('business-categories.edit-sub-category') && (
        <ModalContainer
          lg
          title="Edit Sub Category"
          btnComponent={({ onClick }) => (
            <Tooltip title="Edit" type="dark">
              <Button unStyled className="edit-btn" onClick={onClick}>
                <i className="material-icons-outlined">edit</i>
              </Button>
            </Tooltip>
          )}
          content={({ onClose }) => <SubCategoryFrom onClose={onClose} category={_} />}
        />
      )}
    </ActionBtnHolder>
  );
  const { totalCount, categories_count } = useMemo(
    () => ({
      categories_count: paginatedCategories?.map(_ => [
        format(getDateObject(_.created_at), 'MM/dd/yyyy'),
        _.sub_category_name ?? '--------',
        actionBtns(_),
      ]),
      totalCount: categories.length,
    }),
    [paginatedCategories],
  );
  const columnNames = ['Created At', `Sub Category Name`, ``];
  return (
    <TableLayout
      customFilterKey="ivr-admins"
      onChangeFilters={filters => {
        setSearchQuery(_ => ({
          ..._,
          ...filters,
        }));
      }}
      currentPage={searchQuery.page}
      totalCount={totalCount}
      pageSize={searchQuery.pageSize}>
      <Table width={1200} rowsData={categories_count} columnNames={columnNames} noPadding />
    </TableLayout>
  );
}
