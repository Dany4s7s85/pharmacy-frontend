import styled from 'styled-components/macro';

export const PointsWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  font-weight: bold;
  img {
    width: 16px;
    height: 16px;
    display: block;
  }
`;
export const ImgHolder = styled.div`
  width: 100%;
  overflow: hidden;
  margin-bottom: 4px;
  height: 70px;
  img {
    width: 100%;
    display: block;
  }
`;
export const MapHolder = styled.div`
  border-radius: 20px;
  margin-bottom: 20px;
  overflow: hidden;
  height: 308px;
  width: 100%;
  .gm-control-active {
    border-radius: 100% !important;
  }
  .gm-style-iw {
    max-width: 177px !important;
    padding: 12px !important;
  }
  .gm-style-iw-d {
    overflow: hidden !important;
  }
  .business-detail {
    text-align: center;
    .name {
      display: block;
      text-transform: capitalize;
      margin-bottom: 3px;
      text-align: center;
      font-weight: bold;
    }

    img {
      display: block;
      max-width: 100%;
      height: auto;
      object-fit: cover;
      border-radius: 5px;
    }
  }
`;
export const InfoDetail = styled.div`
  width: 120px;
  height: 120px;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;

export const Name = styled.strong`
  display: block;
  font-size: 11px;
  line-height: 13px;
  margin: 0 0 10px;
`;
