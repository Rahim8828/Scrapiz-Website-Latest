"use client";

import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Card, CardContent } from "@/components/ui/card";

import verifiedImg from "../assets/verfied.jpeg";
import pricingImg from "../assets/pricing.jpeg";
import pickupImg from "../assets/pickup.jpeg";
import img4 from "../assets/whyus.jpeg";
import img5 from "../assets/img5.jpeg";

export default function WhyChooseScrapiz() {
  const slideData = [
    {
      title: "VERIFIED & TRAINED PICKUP PARTNERS",
      desc: "Verified experts for safe and reliable scrap collection.",
      src: verifiedImg,
    },
    {
      title: "TRANSPARENT LIVE PRICING",
      desc: "100% transparent pricing with live rate estimates.",
      src: pricingImg,
    },
    {
      title: "DOORSTEP PICKUP & HEAVY LIFTING",
      desc: "Sit back while we handle the lifting and disposal.",
      src: pickupImg,
    },
    {
      title: "INSTANT BOOKING",
      desc: "Book scrap pickup within seconds.",
      src: img4,
    },
    {
      title: "ECO-FRIENDLY RECYCLING",
      desc: "We ensure responsible recycling and waste management.",
      src: img5,
    },
  ];

  return (
    <section className="mt-24 px-6 md:px-10">
      {/* Heading */}
      <div className="text-center mb-14">
        <h2 className="text-4xl md:text-6xl font-bold">
          Why choose <span className="font-league text-5xl md:text-7xl font-extrabold text-green-700 tracking-tight hover:scale-105 transition-transform">Scrapiz?</span>
        </h2>
        <p className="text-gray-600 mt-4 text-lg">
          Trusted by thousands for sustainable scrap recycling.
        </p>
      </div>

      {/* Carousel */}
      <Carousel opts={{ align: "start" }} className="w-full px-6 sm:px-8">
        <CarouselContent className="-ml-4">
          {slideData.map((item, index) => (
            <CarouselItem
              key={index}
              className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
            >
              <div className="p-1 group">
                <Card
                  className="
                    rounded-3xl overflow-hidden
                    shadow-md
                    transition-all duration-500 ease-out
                    group-hover:-translate-y-3
                    group-hover:shadow-2xl
                    group-hover:scale-[1.02]
                    h-[420px] flex flex-col
                  "
                >
                  {/* Image */}
                  <div className="overflow-hidden">
                    <img
                      src={item.src}
                      alt={item.title}
                      className="
                        h-60 w-full object-cover
                        transition-transform duration-700 ease-out
                        group-hover:scale-110
                      "
                    />
                  </div>

                  {/* Text */}
                  <CardContent className="p-6 transition-colors duration-300">
                    <h3 className="text-xl font-semibold uppercase">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mt-2">{item.desc}</p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Arrows — exact same as ServicesSection */}
        <CarouselPrevious
          className="
            absolute 
            -left-4 sm:-left-6 
            top-1/2 -translate-y-1/2 
            z-30
          "
        />

        <CarouselNext
          className="
            absolute 
            -right-4 sm:-right-6 
            top-1/2 -translate-y-1/2 
            z-30
          "
        />
      </Carousel>
    </section>
  );
}
