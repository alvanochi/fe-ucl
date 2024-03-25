import Link from "next/link";
import React from "react";

export const Hero = () => {
  return (
    <section id="home" className="relative">
      <div className="w-80 h-80 bg-color-blob2 absolute top-0 -left-5 -z-11 blur-2xl opacity-30 overflow-hidden rounded-full"></div>

      <div className="w-80 h-80 bg-color-blob absolute bottom-10 right-0 -z-12 blur-2xl opacity-30 overflow-hidden rounded-full"></div>

      <div className="container py-20">
        <div className="flex flex-col items-center z-20 md:flex-row">
          <div
            data-aos="zoom-in-down"
            className="text-center mb-12 md:text-left md:w-1/2 md:pr-10"
          >
            <h1 className="title mb-4">
              The Academic System of Informatics Engineering
            </h1>
            <p className="leading-relaxed mb-10">
              Enhancing Productivity and Quality of the Three Pillars of Higher
              Education through Gamification Approach in the Academic System of
              Informatics Engineering.
            </p>
            <Link href="/login" className="btn">
              Dashboard
            </Link>
          </div>

          <div data-aos="zoom-in-down" className="md:w-1/2">
            <img src="/img/landing-page/hero-image.png" alt="" />
          </div>
        </div>
      </div>
    </section>
  );
};
