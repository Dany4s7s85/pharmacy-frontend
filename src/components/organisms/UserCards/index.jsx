import TableLayout from 'components/atoms/TableLayout';
import { format } from 'date-fns';
import { getDateObject } from 'helpers/common';
import React, { useEffect, useState } from 'react';
import cardService from 'services/cardService';
import Table from 'components/molecules/Table';
import Toast from 'components/molecules/Toast';

export default function UserCards({ customerId }) {
  const [searchQuery, setSearchQuery] = useState({
    page: 1,
    pageSize: 10,
  });
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginatedCards, setPaginatedCards] = useState([]);

  const getSingleUserCard = async () => {
    try {
      setLoading(true);
      const res = await cardService.getSingleUserCards(customerId);
      if (res) {
        const { userCard } = res;
        setLoading(false);
        setCards(
          userCard.map(_ => [
            format(getDateObject(_?.created_at), 'yyyy-MM-dd'),
            _?.card_number,
            _?.card_id,
            _?.status,
            _?.isCurrent ? 'Yes' : 'No',
          ]),
        );
      }
    } catch (ex) {
      setLoading(false);
      Toast({
        type: 'error',
        message: ex?.message,
      });
    }
  };

  useEffect(() => {
    getSingleUserCard();
  }, [customerId]);
  const paginate = (page, pageSize) => cards.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPaginatedCards(paginate(searchQuery.page, searchQuery.pageSize));
  }, [cards, searchQuery.page, searchQuery.pageSize]);

  return (
    <TableLayout
      customFilterKey="none"
      onChangeFilters={filters => {
        setSearchQuery(_ => ({
          ..._,
          ...filters,
        }));
      }}
      currentPage={searchQuery.page}
      totalCount={cards.length}
      pageSize={searchQuery.pageSize}>
      <Table
        width={1200}
        loading={loading}
        rowsData={paginatedCards}
        columnNames={[`Date`, `Card Number`, `Card ID`, `status`, `Current Card`]}
        noPadding
      />
    </TableLayout>
  );
}
