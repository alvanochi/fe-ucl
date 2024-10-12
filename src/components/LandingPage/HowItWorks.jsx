import React from "react";

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="bg-color-primary-light">
      <div className="container py-20">
        <div data-aos="fade-up" className="text-center m-auto mb-20 md:w-1/2">
          <h4 className="font-bold text-color-secondary mb-4">How It Works</h4>
          <h1 className="title text-primary-700">
            Unlocking the Mechanism, Understanding How It Works.
          </h1>
        </div>

        <div className="flex flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0 md:space-x-6">
          <div data-aos="zoom-in" className="text-center cursor-pointer">
            <div className="relative bg-color-primary-dark inline-block px-6 py-3 rounded-lg cursor-pointer hover:bg-color-secondary ease-in duration-200">
              <p className="text-6xl lg:after:content-[''] lg:after:flex lg:after:bg-[url('/img/landing-page/line.png')] lg:after:absolute lg:after:top-4 lg:after:left-32 2xl:after:left-52 lg:after:bg-no-repeat lg:after:h-7 lg:after:w-52">
                1
              </p>
            </div>
            <h3 className="text-xl font-bold py-4 text-primary-700">
              Create an Account
            </h3>
            <p className="leading-relaxed text-primary-700">
              Start Your Journey. Create an Account Now!
            </p>
          </div>

          <div data-aos="zoom-in" className="text-center cursor-pointer">
            <div className="relative inline-block px-6 py-3 rounded-lg cursor-pointer bg-color-secondary">
              <p className="text-6xl lg:after:content-[''] lg:after:flex lg:after:bg-[url('/img/landing-page/line-bottom.png')] lg:after:absolute lg:after:top-10 lg:after:left-32 2xl:after:left-52 lg:after:bg-no-repeat lg:after:h-7 lg:after:w-52">
                2
              </p>
            </div>
            <h3 className="text-xl font-bold py-4 text-primary-700">
              Setup Your Profile
            </h3>
            <p className="leading-relaxed text-primary-700">
              Optimize Your Presence. Complete Profile Setup!
            </p>
          </div>
          <div data-aos="zoom-in" className="text-center cursor-pointer">
            <div className="relative bg-color-primary-dark inline-block px-6 py-3 rounded-lg cursor-pointer hover:bg-color-secondary ease-in duration-200">
              <p className="text-6xl">3</p>
            </div>
            <h3 className="text-xl font-bold py-4 text-primary-700">
              Enjoy The Game!
            </h3>
            <p className="leading-relaxed text-primary-700">
              Level Up Your Enjoyment. Let the Games Begin!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
