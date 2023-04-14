import React from 'react';
import Slider from 'react-slick';
import {csREASON_LIST} from '../constant'

function ReasonSlider({ reasons }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay:true,
  };


  return (
    <Slider {...settings}>
      {csREASON_LIST.map((reason, index) => (
        <div key={index}>
          <h5>{reason}</h5>
        </div>
      ))}
    </Slider>
  );
}

export default ReasonSlider;
