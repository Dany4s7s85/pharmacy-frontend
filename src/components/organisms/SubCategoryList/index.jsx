/* eslint-disable no-underscore-dangle */
import React from 'react';
import CategoriesService from '../../../services/categoryService';
import { Heading, ListStyle, Li, Button } from './SubCategoryList.styles';

function SubCategoryList({ id, ...props }) {
  const { searchQuery, setSearchQuery } = props;
  const { sub_categories_data } = CategoriesService.GetSubCategories(id);

  const handleSubcategory = i => {
    setSearchQuery(prev => ({ ...prev, page: 1, selectedSubCategory: i }));
  };

  return (
    <>
      <Heading>Featured</Heading>
      <ListStyle>
        <Li>
          <Button
            type="button"
            onClick={() => handleSubcategory('all')}
            className={searchQuery.selectedSubCategory === 'all' && 'active'}>
            All
          </Button>
        </Li>
        {sub_categories_data.map((cat, i) => (
          <Li key={i}>
            <Button
              type="button"
              onClick={() => handleSubcategory(cat._id)}
              className={searchQuery.selectedSubCategory === cat._id && 'active'}>
              {cat?.sub_category_name}
            </Button>
          </Li>
        ))}
      </ListStyle>
    </>
  );
}

export default SubCategoryList;
