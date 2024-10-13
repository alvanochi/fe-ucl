import Link from "next/link";
import React from "react";

export const Hero = () => {
  return (
    <section id="home" className="relative">
      <div className="container py-20">
        <div className="flex flex-col items-center z-20 md:flex-row">
          <div
            data-aos="zoom-in-down"
            className="text-center mb-12 md:text-left md:w-1/2 md:pr-10"
          >
            <h1 className="title mb-4 text-primary-700">UIKA Campus Life</h1>
            <p className="leading-relaxed mb-10 text-primary-700">
              Enhancing Productivity and Quality of the Three Pillars of Higher
              Education through Gamification Approach in the Academic System of
              UIKA CAMPUS LIFE.
            </p>
            <Link href="/login" className="btn bg-primary-500">
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
