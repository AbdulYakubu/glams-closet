import React from 'react';
import HeroImg from '../assets/assets/hero.png';
import { BsFire } from 'react-icons/bs';
import { FaArrowRight } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { FaPlay } from 'react-icons/fa';

const Hero = () => {
  return (
    <section className="max-padd-container bg-hero bg-cover bg-no-repeat h-[667px] w-full mb-10 relative lg:px-12">
      {/* Hero Image and Description */}
      <div className="bg-white p-3 rounded-2xl max-w-[233px] relative top-8 xl:top-12">
        <div className="relative">
          <img
            src={HeroImg}
            alt="hero-img"
            height={211}
            width={211}
            className="rounded-3xl mb-3 w-full h-auto"
          />
          <span className="absolute top-1/2 left-1/2 flexCenter -translate-y-1/2 -translate-x-1/2 h-8 w-8 bg-secondary rounded-full cursor-pointer">
            <span className="absolute h-full w-full rounded-full bg-white opacity-50 animate-ping"></span>
            <FaPlay className="text-sm relative left-[1px] text-white" />
          </span>
        </div>
        <p className="text-[13px]">
          <b className="uppercase">Unlock</b> your best look, one click at a time. Your style upgrade starts here, shop today!
        </p>
      </div>

      {/* Hero Text */}
      <div className="mt-12 sm:mt-20 max-w-[777px]">
        <h5 className="text-[15px] flex items-baseline gap-x-2 uppercase text-secondary medium-18 h5">
          MODERN COLLECTION <BsFire/>
        </h5>
        <h1 className="text-[32px] sm:text-[40px] md:text-[55px] leading-[1.1] h1 font-[500] capitalize max-w-[722px]">
          Every Click brings you closer to perfection. Shop now!
        </h1>
      </div>

      {/* Call-to-Action Button */}
      <div className="flex mt-6 sm:mt-10">
        <Link
          to="/collection" // Add the correct route
          className="bg-white text-xs sm:text-sm font-medium pl-5 pr-2 rounded-full flexCenter gap-x-2 group hover:shadow-lg transition-shadow duration-300"
        >
          Check our modern Collection
          <FaArrowRight className="bg-secondary text-white rounded-full h-8 w-8 sm:h-11 sm:w-11 p-2 sm:p-3 m-[3px] border-white group-hover:-rotate-[20deg] transition-all duration-500" />
        </Link>
      </div>
    </section>
  );
};

export default Hero;