import React from 'react';
import Slider from 'react-slick';

function ReasonSlider({ reasons }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Slider {...settings}>
      {reasons.map((reason, index) => (
        <div key={index}>
          <h3>{reason.title}</h3>
          <p>{reason.description}</p>
        </div>
      ))}
    </Slider>
  );
}

export default ReasonSlider;
