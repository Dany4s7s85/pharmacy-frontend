import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import StoreCategories from '../StoreCategories';
import sidebarImg from '../../../assets/images/sidebar-img.jpg';
import Map from '../../molecules/Map';
import { MacBookBlock, SideNav, Wrap, Heading, MapBlock } from './MacBookView.styles';

function MacBookView({ promotion, mobileView, ...props }) {
  const [searchQuery, setSearchQuery] = useState({
    page: 1,
    pageSize: 10,
    selectedCategory: 'all',
    selectedSubCategory: 'all',
  });
  const [promotionData, setPromotionData] = useState({});

  // eslint-disable-next-line no-shadow
  const structureData = promotion => {
    let { stores } = promotion;
    let totalItems = 0;
    let currentPage = 1;
    let lastPage = 0;

    if (searchQuery.selectedCategory === 'all' && searchQuery.selectedSubCategory === 'all') {
      stores = stores.slice(searchQuery?.page - 1 * searchQuery?.pageSize, searchQuery?.page * searchQuery?.pageSize);
      totalItems = stores.length;
      currentPage = searchQuery?.page;
      lastPage = Math.ceil(totalItems / searchQuery?.pageSize);
    } else if (searchQuery.selectedCategory !== 'all' && searchQuery.selectedSubCategory === 'all') {
      stores = stores
        .filter(store => store.store_category.category_id === searchQuery.selectedCategory)
        .slice(searchQuery?.page - 1 * searchQuery?.pageSize, searchQuery?.page * searchQuery?.pageSize);
      totalItems = stores.filter(store => store.store_category.category_id === searchQuery.selectedCategory).length;
      currentPage = searchQuery?.page;
      lastPage = Math.ceil(totalItems / searchQuery?.pageSize);
    } else if (searchQuery.selectedCategory !== 'all' && searchQuery.selectedSubCategory !== 'all') {
      stores = stores
        .filter(
          store =>
            store.store_category.category_id === searchQuery.selectedCategory &&
            store.store_category.sub_category_id === searchQuery.selectedSubCategory,
        )
        .slice(searchQuery?.page - 1 * searchQuery?.pageSize, searchQuery?.page * searchQuery?.pageSize);
      totalItems = stores.filter(
        store =>
          store.store_category.category_id === searchQuery.selectedCategory &&
          store.store_category.sub_category_id === searchQuery.selectedSubCategory,
      ).length;
      currentPage = searchQuery?.page;
      lastPage = Math.ceil(totalItems / searchQuery?.pageSize);
    }
    return { stores, totalItems, currentPage, lastPage, promotion };
  };
  useEffect(() => {
    setPromotionData(structureData(promotion));
  }, [searchQuery]);
  return (
    <>
      <MacBookBlock id="promotion-panel" mobileView={mobileView}>
        <SideNav>
          <img src={sidebarImg} width="36" height="469" alt="sidebar" />
        </SideNav>
        <Wrap>
          <Heading>Promotion</Heading>
          <MapBlock>
            <Map campaignsData={promotionData} />
          </MapBlock>
          <StoreCategories
            {...props}
            campaignsData={promotionData}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            mobileView={mobileView}
          />
        </Wrap>
      </MacBookBlock>
    </>
  );
}

export default MacBookView;
