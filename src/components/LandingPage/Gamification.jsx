import React from "react";
import { Icon } from "@iconify-icon/react";

export const Gamification = () => {
  return (
    <section id="gamification" className="bg-color-primary-light">
      <div className="container py-20">
        <div data-aos="fade-up" className="text-center m-auto mb-20 md:w-1/2">
          <h4 className="font-bold text-color-secondary mb-4">Gamification</h4>
          <h1 className="title">
            Leveling Up Learning. Harnessing Gamification for Engagement and
            Innovation.
          </h1>
        </div>

        <div
          data-aos="fade-up"
          className="grid lg:grid-cols-3 md:grid-cols-2 gap-12 lg:gap-8 px-4 sm:px-6 lg:px-8"
        >
          <div
            data-aos="flip-down"
            className="border-2 border-solid border-color-gray text-center py-20 px-5 rounded-2xl cursor-pointer hover:bg-color-primary-dark ease-in duration-200"
          >
            <div className="bg-color-secondary inline-block rounded-2xl py-5 px-6">
              <Icon icon="ph:flask-fill" width={50} height={50} />
            </div>
            <h3 className="text-xl font-bold py-4">Research</h3>
            <p className="leading-relaxed">
              Exploring Frontiers. Unraveling New Horizons through Research.
            </p>
          </div>

          <div
            data-aos="flip-down"
            className="bg-color-primary-dark border-2 border-solid border-color-gray text-center py-20 px-5 rounded-2xl cursor-pointer"
          >
            <div className="bg-color-secondary inline-block rounded-2xl py-5 px-6">
              <Icon icon="game-icons:graduate-cap" width={50} height={50} />
            </div>
            <h3 className="text-xl font-bold py-4">Education</h3>
            <p className="leading-relaxed">
              Empowering Minds and Shaping Futures. The Transformative Force of
              Education.
            </p>
          </div>

          <div
            data-aos="flip-down"
            className="border-2 border-solid border-color-gray text-center py-20 px-5 rounded-2xl cursor-pointer hover:bg-color-primary-dark ease-in duration-200"
          >
            <div className="bg-color-secondary inline-block rounded-2xl py-5 px-6">
              <Icon icon="gg:community" width={50} height={50} />
            </div>
            <h3 className="text-xl font-bold py-4">Community Service</h3>
            <p className="leading-relaxed">
              Serving Beyond Self. Dedicated Initiatives for Community
              Engagement.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
