import React from 'react';
import Loaders from 'components/atoms/Loaders';
import equifaxService from 'services/equifaxService';

const EquifaxtriggerFileDetail = ({ _ }) => {
  const { fileData_loading, fileData_data } = equifaxService.GetFileData(_);
  return <Loaders loading={fileData_loading}>{fileData_data?.data}</Loaders>;
};

export default EquifaxtriggerFileDetail;
