import React from "react";

export const Blog = () => {
  return (
    <section id="blog">
      <div className="container py-20">
        <div className="text-center m-auto mb-20 md:w-1/2">
          <h4 className="font-bold text-color-secondary mb-4">
            Innovation And Quality Improvement
          </h4>
          <h1 className="title">Latest Updates, Solutions And Company News</h1>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <div className="lg:h-[40vh] rounded-xl scale-100 overflow-hidden">
              <img
                src="/img/landing-page/blog1.jpg"
                alt=""
                className="lg:h-full w-full hover:scale-125 transition duration-300 ease-in-out"
              />
            </div>

            <div>
              <div className="flex items-center gap-5 py-5">
                <p>20 August 2022</p>
                <p>1 min read</p>
              </div>

              <a
                href="#blog"
                className="text-2xl font-bold underline hover:text-color-secondary hover:no-underline"
              >
                Four ways to cheer yourself up on Blue Monday!
              </a>

              <p className="leading-relaxed my-5">
                On the second edition of Serious Business, Inc. editor Jim
                Ledbetter and Fusion senior editor Salmon debate...
              </p>

              <a
                href="#blog"
                className="inline-block font-bold hover:text-color-secondary transition-all duration-300 ease-in-out"
              >
                <span className="tracking-wider capitalize underline hover:no-underline">
                  Read more
                </span>
              </a>
            </div>
          </div>

          <div>
            <div className="lg:h-[40vh] rounded-xl scale-100 overflow-hidden">
              <img
                src="/img/landing-page/blog2.jpg"
                alt=""
                className="lg:h-full w-full hover:scale-125 transition duration-300 ease-in-out"
              />
            </div>

            <div>
              <div className="flex items-center gap-5 py-5">
                <p>20 August 2022</p>
                <p>1 min read</p>
              </div>

              <a
                href="#blog"
                className="text-2xl font-bold underline hover:text-color-secondary hover:no-underline"
              >
                How to Organize Your budget for Maximum Productivity?
              </a>

              <p className="leading-relaxed my-5">
                Global provider connected products for consumers, and
                enterprises worldwide, supply chain control is everything...
              </p>

              <a
                href="#blog"
                className="inline-block font-bold hover:text-color-secondary transition-all duration-300 ease-in-out"
              >
                <span className="tracking-wider capitalize underline hover:no-underline">
                  Read more
                </span>
              </a>
            </div>
          </div>

          <div>
            <div className="lg:h-[40vh] rounded-xl scale-100 overflow-hidden">
              <img
                src="/img/landing-page/blog3.jpg"
                alt=""
                className="lg:h-full w-full hover:scale-125 transition duration-300 ease-in-out"
              />
            </div>

            <div>
              <div className="flex items-center gap-5 py-5">
                <p>20 August 2022</p>
                <p>1 min read</p>
              </div>

              <a
                href="#blog"
                className="text-2xl font-bold underline hover:text-color-secondary hover:no-underline"
              >
                Should Small Businesses Be Entitled to system?
              </a>

              <p className="leading-relaxed my-5">
                Our team provides skilled & experienced managers who know the
                intricacies of this vertical and focus...
              </p>

              <a
                href="#blog"
                className="inline-block font-bold hover:text-color-secondary transition-all duration-300 ease-in-out"
              >
                <span className="tracking-wider capitalize underline hover:no-underline">
                  Read more
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
