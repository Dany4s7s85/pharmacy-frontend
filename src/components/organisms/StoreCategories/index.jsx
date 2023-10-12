/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
import React, { useState, useContext, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.min.css';

// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import Skeleton from 'react-loading-skeleton';
import storeimg from '../../../assets/images/img02.jpg';
import CategoriesList from '../CategoriesList';
import StoreDetailPanel from '../StoreDetailPanel';
import { StoreCategory, Heading, StyledStoreColumn, NoRecordMsg } from './StoreCategories.styles';
import { LoadingContext } from '../../../context/loadingContext';
import { shortenString } from '../../../helpers/common';
import Grid from '../../atoms/Grid';
import { AuthContext } from '../../../context/authContext';
import { Icon } from '../CategoriesList/CategoriesList.styles';
import Pagination from '../../molecules/Pagination';

function StoreCategories({ campaignsData, searchText, setSearchText, mobileView, ...props }) {
  const { searchQuery, setSearchQuery } = props;
  const { isLoading } = useContext(LoadingContext);
  const [panelVisible, setPanelVisible] = useState(false);
  const [storeData, setStoreData] = useState({});
  const { user } = useContext(AuthContext);

  const handleStoreClick = store => {
    setStoreData(store);
    setPanelVisible(true);
    const p = document.getElementById('promotion-panel');
    p.classList.add('panel-active');
  };
  return (
    <>
      <StoreCategory>
        {isLoading ? <Skeleton height={25} width={120} /> : <Heading>Categories</Heading>}
        <CategoriesList mobileView={mobileView} {...props} />
        {mobileView ? (
          <Swiper slidesPerView={2} spaceBetween={10} className="mySwiper">
            {campaignsData?.stores?.length
              ? campaignsData?.stores?.map(campaign => (
                  <SwiperSlide>
                    <StyledStoreColumn
                      key={campaignsData?.promotion?._id}
                      storeId={campaignsData?.promotion?._id}
                      storeimg={
                        campaignsData?.promotion?.image_url
                          ? campaignsData?.promotion?.image_url
                          : campaign?.image_url
                          ? campaign?.image_url
                          : user?.attachments?.business_logo?.cloudinary_url
                          ? user?.attachments?.business_logo?.cloudinary_url
                          : storeimg
                      }
                      title={shortenString(campaign?.name, 20)}
                      subtitle={
                        campaign.address.street_address !== 'undefined'
                          ? shortenString(campaign.address.street_address, 20)
                          : campaign.address.city
                      }
                      points={
                        campaignsData?.promotion?.offer_type === 'percentBased'
                          ? String(campaignsData?.promotion?.offer_details.minimum_plastk_point_value?.toFixed(0))
                          : String(campaignsData?.promotion?.offer_details.plastk_points_value)
                      }
                      onClick={() => handleStoreClick(campaign)}
                      campaignId={campaignsData?.promotion?._id}
                      favourite={campaign?.isFavourite}
                    />
                  </SwiperSlide>
                ))
              : null}
            {!campaignsData?.stores?.length && (
              <NoRecordMsg>
                <Icon className="icon-frown-o" css="color:#fff;font-size:30px; margin-bottom:6px" />
                No active promotions in your area
              </NoRecordMsg>
            )}
          </Swiper>
        ) : (
          <>
            <Grid xs={4} gap={10}>
              {campaignsData?.stores?.length
                ? campaignsData?.stores?.map(campaign => (
                    <StyledStoreColumn
                      key={campaignsData._id}
                      storeId={campaignsData._id}
                      storeimg={
                        campaignsData?.promotion?.image_url
                          ? campaignsData?.promotion?.image_url
                          : campaign?.image_url
                          ? campaign?.image_url
                          : user?.attachments?.business_logo?.cloudinary_url
                          ? user?.attachments?.business_logo?.cloudinary_url
                          : storeimg
                      }
                      title={shortenString(campaign?.name, 20)}
                      subtitle={
                        campaign.address.street_address !== 'undefined'
                          ? shortenString(campaign.address.street_address, 20)
                          : campaign.address.city
                      }
                      points={
                        campaignsData?.promotion?.offer_type === 'percentBased'
                          ? String(campaignsData?.promotion?.offer_details.minimum_plastk_point_value?.toFixed(0))
                          : String(campaignsData?.promotion?.offer_details.plastk_points_value)
                      }
                      onClick={() => handleStoreClick(campaign)}
                      campaignId={campaignsData?._id}
                      favourite={campaign?.isFavourite}
                      {...props}
                    />
                  ))
                : null}
            </Grid>
            {!campaignsData?.stores?.length && (
              <NoRecordMsg>
                <Icon className="icon-frown-o" css="color:#fff;font-size:30px; margin-bottom:6px" />
                No active promotions in your area
              </NoRecordMsg>
            )}
            {campaignsData?.stores?.length && campaignsData?.totalItems > 0 && (
              <Pagination
                className="pagination-bar"
                currentPage={searchQuery.page}
                totalCount={campaignsData?.totalItems}
                pageSize={10}
                onPageChange={newPage => {
                  setSearchQuery(prevState => ({
                    ...prevState,
                    page: newPage,
                  }));
                }}
              />
            )}
          </>
        )}
      </StoreCategory>
      {panelVisible && (
        <StoreDetailPanel
          setPanelVisible={setPanelVisible}
          storeData={storeData}
          campaignDetails={campaignsData}
          mobileView={mobileView}
        />
      )}
    </>
  );
}

export default StoreCategories;
