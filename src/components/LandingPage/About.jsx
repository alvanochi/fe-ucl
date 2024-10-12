import React from "react";

export const About = () => {
  return (
    <section id="about">
      <div className="container py-20 relative">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div data-aos="fade-right" className="mb-12 md:w-1/2">
            <img src="/img/landing-page/about.png" alt="" />
          </div>

          <div
            data-aos="fade-left"
            className="text-center md:text-left md:w-1/2 md:ml-20"
          >
            <h4 className="font-bold text-color-secondary mb-4">About</h4>
            <h1 className="title mb-4 text-primary-700">
              Unveiling Excellence, Insights into Our Mission and Values.
            </h1>
            <p className="leading-relaxed mb-10 text-primary-700">
              The UCL application with the implementation of gamification based
              on the Tridharma of higher education is developed on two
              platforms: web and mobile. The web platform is used for the data
              input process of achievements obtained by students, while the
              mobile platform is designed so that each student can get
              information related to leaderboards, scores, and levels they have
              achieved.
            </p>
            <a href="/register" target="_blank" className="btn bg-primary-500">
              Register
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
