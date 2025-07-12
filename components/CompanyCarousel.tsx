"use client";

import React from "react";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import AutoPlay from "embla-carousel-autoplay";
import { Companies } from "@/constants/companies";
import Image from "next/image";

const CompanyCarousel = () => {
  return (
    // <div className="py-6 px-4 bg-slate-900 rounded-xl border border-slate-700">
    //   <Carousel plugins={[AutoPlay({ delay: 2000, stopOnInteraction: true })]} className="w-full">
    //     <CarouselContent className="flex items-center">
    //       {Companies.map(({ name, path, id }) => (
    //         <CarouselItem
    //           key={id}
    //           className="flex justify-center items-center  basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6 px-4"
    //         >
    //           <Image
    //             src={path}
    //             alt={`${name} logo`}
    //             height={56}
    //             width={160}
    //             className="h-12 sm:h-14 object-contain transition-all duration-300"
    //           />
    //         </CarouselItem>
    //       ))}
    //     </CarouselContent>
    //   </Carousel>
    // </div>

    <div className="overflow-hidden py-6 bg-slate-900 border border-slate-800 rounded-xl">
      <div className="flex w-max space-x-12 px-6 animate-scroll-x">
        {[...Companies, ...Companies].map(({ name, path, id }, index) => (
          <div
            key={`${id}-${index}`}
            className="flex flex-shrink-0 items-center justify-center"
          >
            <Image
              src={path}
              alt={`${name} logo`}
              height={80}
              width={200}
              className="object-contain transition duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyCarousel;
