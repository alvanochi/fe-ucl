import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export const Support = () => {
  return (
    <section id="support" className="bg-color-primary-light">
      <div className="container py-20">
        <div className="text-center text-primary-700 m-auto mb-20 md:w-1/2">
          <h4 className="font-bold text-color-secondary mb-4 ">Support</h4>
          <h1 className="text-primary-700">
            need help? Or do you have suggestions for improving the app? Please
            share your feedback!
          </h1>
        </div>

        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          slidesPerView={3}
          spaceBetween={30}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={{ clickable: true }}
          className="mySwiper"
        >
          <SwiperSlide>
            <div className="card relative h-auto w-auto">
              <div
                id="card_1_front"
                className="front px-7 py-11 rounded-2xl border-2 border-solid border-color-gray h-full w-full"
              >
                <div className="md:w-80">
                  <img src="/img/wahyu.jpeg" alt="" className="rounded-2xl" />
                </div>

                <div className="py-10 text-center text-primary-700">
                  <h3 className="text-xl font-bold pb-3 text-primary-700">
                    Mobile Developer
                  </h3>
                  <span className="text-md pb-3 text-primary-700">
                    Wahyu Ramadhan
                  </span>{" "}
                  <br />
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="card relative h-auto w-auto">
              <div
                id="card_1_front"
                className="front px-7 py-11 rounded-2xl border-2 border-solid border-color-gray h-full w-full"
              >
                <div className="md:w-80">
                  <img src="/img/azis.jpg" alt="" className="rounded-2xl" />
                </div>

                <div className="py-10 text-center text-primary-700">
                  <h3 className="text-xl font-bold pb-3 text-primary-700">
                    Back-End Engineer
                  </h3>
                  <span className="text-md pb-3 text-primary-700">
                    Muhammad Azis Pratama
                  </span>{" "}
                  <br />
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="card relative h-auto w-auto">
              <div
                id="card_1_front"
                className="front px-7 py-11 rounded-2xl border-2 border-solid border-color-gray h-full w-full"
              >
                <div className="md:w-80">
                  <img src="/img/tamam.jpeg" alt="" className="rounded-2xl" />
                </div>

                <div className="py-10 text-center text-primary-700">
                  <h3 className="text-xl font-bold pb-3 text-primary-700">
                    Web Developer
                  </h3>
                  <span className="text-md pb-3 text-primary-700">
                    Mochammad Tamam Mulya
                  </span>{" "}
                  <br />
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="card relative h-auto w-auto">
              <div
                id="card_1_front"
                className="front px-7 py-11 rounded-2xl border-2 border-solid border-color-gray h-full w-full"
              >
                <div className="md:w-80">
                  <img src="/img/tamam.jpeg" alt="" className="rounded-2xl" />
                </div>

                <div className="py-10 text-center text-primary-700">
                  <h3 className="text-xl font-bold pb-3 text-primary-700">
                    Web Developer
                  </h3>
                  <span className="text-md pb-3 text-primary-700">
                    Mochammad Tamam Mulya
                  </span>{" "}
                  <br />
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="card relative h-auto w-auto">
              <div
                id="card_1_front"
                className="front px-7 py-11 rounded-2xl border-2 border-solid border-color-gray h-full w-full"
              >
                <div className="md:w-80">
                  <img src="/img/tamam.jpeg" alt="" className="rounded-2xl" />
                </div>

                <div className="py-10 text-center text-primary-700">
                  <h3 className="text-xl font-bold pb-3 text-primary-700">
                    Web Developer
                  </h3>
                  <span className="text-md pb-3 text-primary-700">
                    Mochammad Tamam Mulya
                  </span>{" "}
                  <br />
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="card relative h-auto w-auto">
              <div
                id="card_1_front"
                className="front px-7 py-11 rounded-2xl border-2 border-solid border-color-gray h-full w-full"
              >
                <div className="md:w-80">
                  <img src="/img/tamam.jpeg" alt="" className="rounded-2xl" />
                </div>

                <div className="py-10 text-center text-primary-700">
                  <h3 className="text-xl font-bold pb-3 text-primary-700">
                    Web Developer
                  </h3>
                  <span className="text-md pb-3 text-primary-700">
                    Mochammad Tamam Mulya
                  </span>{" "}
                  <br />
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
};
