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
import serviceImg from "../assets/service.jpg";

export default function ServicesSection() {
  const slideData = [
    {
      title: "Scrap Pickup",
      desc: "Doorstep scrap collection made easy.",
      src: serviceImg,
    },
    {
      title: "Bulk Scrap Collection",
      desc: "For apartments, offices & industries.",
      src: serviceImg,
    },
    {
      title: "E-Waste Recycling",
      desc: "Safe disposal of electronic waste.",
      src: serviceImg,
    },
    {
      title: "Industrial Scrap",
      desc: "Efficient scrap handling solutions.",
      src: serviceImg,
    },
  ];

  return (
    <section className="mt-24 px-6 md:px-10">
      {/* Heading */}
      <div className="text-center mb-14">
        <h2 className="text-4xl md:text-6xl font-bold">Our Services</h2>
        <p className="text-gray-600 mt-4 text-lg">
          Smart, reliable and hassle-free scrap solutions.
        </p>
      </div>

      {/* Carousel */}
      <Carousel opts={{ align: "start" }} className="w-full px-6 sm:px-8">
        <CarouselContent className="-ml-4">
          {slideData.map((service, index) => (
            <CarouselItem
              key={index}
              className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
            >
              <div className="p-1 group">
                <Card
                  className="rounded-3xl overflow-hidden 
                 shadow-md 
                 transition-all duration-500 ease-out
                 group-hover:-translate-y-3
                 group-hover:shadow-2xl
                 group-hover:scale-[1.02]"
                >
                  {/* Image */}
                  <div className="overflow-hidden">
                    <img
                      src={service.src}
                      alt={service.title}
                      className="h-60 w-full object-cover 
                     transition-transform duration-700 ease-out
                     group-hover:scale-110"
                    />
                  </div>

                  {/* Content */}
                  <CardContent className="p-6 transition-colors duration-300">
                    <h3 className="text-2xl font-semibold">{service.title}</h3>
                    <p className="text-gray-600 mt-2">{service.desc}</p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

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
