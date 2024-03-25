import React from "react";

export const DownloadApp = () => {
  return (
    <section id="download-app" className="bg-color-primary-light">
      <div className="container h-[80vh] grid place-items-center">
        <div className="text-center md:w-2/3 m-auto">
          <h1 className="title">
            Download The Application Now and Check Your Rank.
          </h1>
          <p className="leading-relaxed pt-5">
            Explore the app, climb the ranks, and track your progress!
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-5 pt-10">
            <a
              href="#"
              className="bg-color-white h-16 w-44 grid place-items-center rounded-lg hover:opacity-70"
            >
              <img src="/img/landing-page/ios-store-dark.png" alt="" />
            </a>
            <a
              href="#"
              className="bg-color-white h-16 w-44 grid place-items-center rounded-lg hover:opacity-70"
            >
              <img src="/img/landing-page/g-play-dark.png" alt="" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
