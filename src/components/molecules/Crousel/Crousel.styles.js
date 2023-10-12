import styled from "styled-components";

export const CarouselWrapper = styled.div`
  
`;

export const CarouselItem = styled.div`
${props => props.imageUrl && `background-image: url(${props.imageUrl})`};
  height: 0;
  padding: 0;
  padding-bottom: 40%;
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  overflow:hidden;
  @media (max-width: 800px) {
    padding-bottom: 70%;
  }
`;

export const CarouselText = styled.div`
  margin: 0 auto;
  max-width: 700px;
  margin-top: 100px;
  text-align: center;
  @media (max-width: 800px) {
    margin-top: 4%;
  }
`;