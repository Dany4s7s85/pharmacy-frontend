import {CarouselItem, CarouselWrapper, CarouselText} from './Crousel.styles'
import Heading from '../../atoms/Heading/index'
import Paragraph from '../../atoms/Paragraph';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const Carousel = ({carouselData}) => {
    const settings = {
      dots: true,
      infinite: true,
      speed: 2000,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      arrows:false,
    };
  
    return (
      <CarouselWrapper>
        <Slider {...settings}>
          {carouselData.map((item, index) => (
            <CarouselItem key={index} imageUrl={item.imageUrl}>
              {item.heading && <CarouselText>
                  <Heading level={2} children={item.heading}/>
                  <Paragraph children={item.text}/>
                </CarouselText>}  
            </CarouselItem>
          ))}
        </Slider>
      </CarouselWrapper>
    );
  };

  export default Carousel;