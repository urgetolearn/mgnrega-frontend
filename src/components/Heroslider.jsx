import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import banner1 from "../assets/banner-8b.webp";
import banner2 from "../assets/banner-7b.webp";
import banner3 from "../assets/banner-17b.webp";

const HeroSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    <div className="relative w-full">
      <div className="relative z-10 mt-12">
        <Slider {...settings}>
          <div>
            <img
              src={banner1}
              alt="MGNREGA banner"
              className="w-full object-cover h-64 md:h-96"
            />
          </div>
          <div>
            <img
              src={banner2}
              alt="MGNREGA banner 2"
              className="w-full object-cover h-64 md:h-96"
            />
          </div>
          <div>
            <img
              src={banner3}
              alt="MGNREGA banner 3"
              className="w-full object-cover h-64 md:h-96"
            />
          </div>
        </Slider>
      </div>
    </div>
  );
};

export default HeroSlider;
