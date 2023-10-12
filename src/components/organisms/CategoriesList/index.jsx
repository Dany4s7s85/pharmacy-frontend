import React, { useContext } from 'react';
import Skeleton from 'react-loading-skeleton';
import SwiperCore, { Navigation } from 'swiper/core';
import { Swiper, SwiperSlide } from 'swiper/react';
import CategoriesService from '../../../services/categoryService';
import { SwiperHolder, Box, ImgBox, Icon, Title } from './CategoriesList.styles';
import SubCategoryList from '../SubCategoryList';
import { LoadingContext } from '../../../context/loadingContext';
import 'swiper/swiper-bundle.min.css';

SwiperCore.use([Navigation]);

function CategoriesList(props) {
  const { isLoading } = useContext(LoadingContext);
  const { categories_data } = CategoriesService.GetCategories();
  const { searchQuery, setSearchQuery, mobileView } = props;

  const handleCategory = id => {
    setSearchQuery(prev => ({ ...prev, page: 1, selectedCategory: id, selectedSubCategory: 'all' }));
  };
  return (
    <>
      <SwiperHolder mobileView={mobileView}>
        <Swiper
          navigation={!mobileView}
          modules={[Navigation]}
          slidesPerView={mobileView ? 4 : 8}
          spaceBetween={10}
          className="category-swiper">
          {isLoading ? (
            <Skeleton circle height={50} width={50} css="margin-right:20px;" />
          ) : (
            <SwiperSlide
              onClick={() => {
                setSearchQuery(prev => ({ ...prev, page: 1, selectedCategory: 'all', selectedSubCategory: 'all' }));
              }}>
              <Box className={searchQuery.selectedCategory === 'all' && 'active'}>
                <ImgBox type="button" className="img-box">
                  <Icon className="icon-categories">
                    <span className="material-icons-outlined">all_inclusive</span>
                  </Icon>
                </ImgBox>
                <Title>All</Title>
              </Box>
            </SwiperSlide>
          )}
          {isLoading
            ? [...Array(7).keys()].map(e => <Skeleton key={e} circle height={50} width={50} css="margin:0 20px;" />)
            : categories_data?.length &&
              categories_data?.map((cat, index) => (
                // eslint-disable-next-line no-underscore-dangle
                <SwiperSlide onClick={() => handleCategory(cat._id)} key={index}>
                  {/* eslint-disable-next-line no-underscore-dangle */}
                  <Box className={searchQuery.selectedCategory === cat._id && 'active'}>
                    <ImgBox type="button">
                      <img src={cat?.category_image_url} alt="img" />
                    </ImgBox>
                    <Title>{cat?.category_name}</Title>
                  </Box>
                </SwiperSlide>
              ))}
        </Swiper>
      </SwiperHolder>

      {searchQuery.selectedCategory !== 'all' && <SubCategoryList {...props} id={searchQuery.selectedCategory} />}
    </>
  );
}

export default CategoriesList;
