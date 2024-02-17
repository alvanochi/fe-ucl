import Head from "next/head";
import { useEffect, useState } from "react";
import { Icon } from "@iconify-icon/react";
import Link from "next/link";

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; // Import Swiper styles
import 'swiper/css/effect-coverflow'; // Import coverflow effect styles
import 'swiper/css/pagination'; // Import pagination styles

// Import Swiper core and required modules
import SwiperCore, { EffectCoverflow, Pagination } from 'swiper';

// Install Swiper modules
SwiperCore.use([EffectCoverflow, Pagination]);

const Home = () => {
  const [isSticky, setSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector("header");
      const sectionn = document.querySelectorAll("section");
      const navlinkss = document.querySelectorAll("nav ul li a");

      if (window.scrollY > 100) {
        navbar.classList.add(
          "bg-color-primary-dark",
          "border-b",
          "border-color-gray"
        );
      } else {
        navbar.classList.remove(
          "bg-color-primary-dark",
          "border-b",
          "border-color-gray"
        );
      }

      // active link
      let current = "home";

      sectionn.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 60) {
          current = section.getAttribute("id");
        }
      });

      navlinkss.forEach((item) => {
        item.classList.remove("text-color-secondary");
        if (item.href.includes(current)) {
          item.classList.add("text-color-secondary");
        }
      });
    };

    window.onscroll = handleScroll;

    return () => {
      window.onscroll = null;
    };
  }, []);

  const handleHamburgerClick = () => {
    const menu = document.querySelector("#menu");
    const faSolid = document.querySelector(".fa-solid");
    menu.classList.toggle("hidden");
    faSolid.classList.toggle("fa-xmark");
  };

  const handleLinkClick = () => {
    const menu = document.querySelector("#menu");
    const faSolid = document.querySelector(".fa-solid");
    menu.classList.toggle("hidden");
    faSolid.classList.toggle("fa-xmark");
  };

  const handleReviewClick = (event) => {
    const userTexts = document.getElementsByClassName("user-text");
    const userPics = document.getElementsByClassName("user-pic");

    for (let userPic of userPics) {
      userPic.classList.remove("active-pic");
    }
    for (let userText of userTexts) {
      userText.classList.remove("active-text");
    }

    const i = Array.from(userPics).indexOf(event.target);

    userPics[i].classList.add("active-pic");
    userTexts[i].classList.add("active-text");
  };

  const handleToggleChange = () => {
    const card_1_front = document.querySelector("#card_1_front");
    const card_1_back = document.querySelector("#card_1_back");

    const card_2_front = document.querySelector("#card_2_front");
    const card_2_back = document.querySelector("#card_2_back");

    const card_3_front = document.querySelector("#card_3_front");
    const card_3_back = document.querySelector("#card_3_back");

    card_1_front.classList.toggle("-rotate-y-180");
    card_1_back.classList.toggle("rotate-y-180");

    card_2_front.classList.toggle("-rotate-y-180");
    card_2_back.classList.toggle("rotate-y-180");

    card_3_front.classList.toggle("-rotate-y-180");
    card_3_back.classList.toggle("rotate-y-180");
  };

  return (
    <>
      <Head>
        <title>
          Tias
        </title>
      </Head>
      <div className="bg-color-primary text-color-white tracking-wider">
        <header
          className={`sticky top-0 z-50 ${
            isSticky ? "bg-color-primary-dark border-b border-color-gray" : ""
          }`}
        >
          <nav className="container flex justify-between items-center">
            <div className="py-5 text-color-secondary font-bold text-3xl">
              <a href="#home">
                <img src="/img/landing-page/logo-tias.png" alt="" width="170" />
              </a>
            </div>
            <div>
              <ul className="hidden lg:flex items-center space-x-6">
                <li>
                  <a
                    href="#home"
                    className="hover:text-color-secondary ease-in duration-200"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#gamification"
                    className="hover:text-color-secondary ease-in duration-200"
                  >
                    Gamification
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    className="hover:text-color-secondary ease-in duration-200"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    id="hLink"
                    href="#support"
                    className="hover:text-color-secondary ease-in duration-200"
                  >
                    Support
                  </a>
                </li>
                {/* <li>
                  <a
                    href="#pricing"
                    className="hover:text-color-secondary ease-in duration-200"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#blog"
                    className="hover:text-color-secondary ease-in duration-200"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="hover:text-color-secondary ease-in duration-200"
                  >
                    Contact
                  </a>
                </li> */}

                <li>
                  <Link
                    href="/login"
                    className="bg-color-secondary px-9 py-3 rounded-md capitalize font-bold hover:opacity-80 ease-in duration-200"
                  >
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            <div
              id="hamburger"
              className="lg:hidden cursor-pointer z-50"
              onClick={handleHamburgerClick}
            >
              <Icon icon="material-symbols:menu" width={35} height={35} />
            </div>

            <div
              id="menu"
              className="hidden bg-color-primary-dark h-[100vh] absolute inset-0"
            >
              <ul className="h-full grid place-items-center py-20">
                <li>
                  <a
                    id="hLink"
                    href="#home"
                    className="hover:text-color-secondary ease-in duration-200"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    id="hLink"
                    href="#gamification"
                    className="hover:text-color-secondary ease-in duration-200"
                  >
                    Gamification
                  </a>
                </li>
                <li>
                  <a
                    id="hLink"
                    href="#about"
                    className="hover:text-color-secondary ease-in duration-200"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    id="hLink"
                    href="#support"
                    className="hover:text-color-secondary ease-in duration-200"
                  >
                    Support
                  </a>
                </li>
                {/* <li>
                  <a
                    id="hLink"
                    href="#blog"
                    className="hover:text-color-secondary ease-in duration-200"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    id="hLink"
                    href="#contact"
                    className="hover:text-color-secondary ease-in duration-200"
                  >
                    Contact
                  </a>
                </li> */}

                <li>
                  <Link href="/login" className="btn">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </header>

        <main>
          <section id="home" className="relative">
            <div className="w-80 h-80 bg-color-blob2 absolute top-0 -left-5 -z-11 blur-2xl opacity-30 overflow-hidden rounded-full"></div>

            <div className="w-80 h-80 bg-color-blob absolute bottom-10 right-0 -z-12 blur-2xl opacity-30 overflow-hidden rounded-full"></div>

            <div className="container py-20">
              <div className="flex flex-col items-center z-20 md:flex-row">
                <div className="text-center mb-12 md:text-left md:w-1/2 md:pr-10">
                  <h1 className="title mb-4">
                    The Academic System of Informatics Engineering
                  </h1>
                  <p className="leading-relaxed mb-10">
                    Enhancing Productivity and Quality of the Three Pillars of
                    Higher Education through Gamification Approach in the
                    Academic System of Informatics Engineering.
                  </p>
                  <Link href="/login" className="btn">
                    Dashboard
                  </Link>
                </div>

                <div className="md:w-1/2">
                  <img src="/img/landing-page/hero-image.png" alt="" />
                </div>
              </div>
            </div>
          </section>

          <section id="gamification" className="bg-color-primary-light">
            <div className="container py-20">
              <div className="text-center m-auto mb-20 md:w-1/2">
                <h4 className="font-bold text-color-secondary mb-4">
                  Gamification
                </h4>
                <h1 className="title">
                  Leveling Up Learning. Harnessing Gamification for Engagement
                  and Innovation.
                </h1>
              </div>

              <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-12 lg:gap-8 px-4 sm:px-6 lg:px-8">
                <div className="border-2 border-solid border-color-gray text-center py-20 px-5 rounded-2xl cursor-pointer hover:bg-color-primary-dark ease-in duration-200">
                  <div className="bg-color-secondary inline-block rounded-2xl py-5 px-6">
                    <Icon icon="ph:flask-fill" width={50} height={50} />
                  </div>
                  <h3 className="text-xl font-bold py-4">Research</h3>
                  <p className="leading-relaxed">
                    Exploring Frontiers. Unraveling New Horizons through
                    Research.
                  </p>
                </div>

                <div className="bg-color-primary-dark border-2 border-solid border-color-gray text-center py-20 px-5 rounded-2xl cursor-pointer">
                  <div className="bg-color-secondary inline-block rounded-2xl py-5 px-6">
                    <Icon
                      icon="game-icons:graduate-cap"
                      width={50}
                      height={50}
                    />
                  </div>
                  <h3 className="text-xl font-bold py-4">Education</h3>
                  <p className="leading-relaxed">
                    Empowering Minds and Shaping Futures. The Transformative
                    Force of Education.
                  </p>
                </div>

                <div className="border-2 border-solid border-color-gray text-center py-20 px-5 rounded-2xl cursor-pointer hover:bg-color-primary-dark ease-in duration-200">
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

          <section id="about">
            <div className="container py-20 relative">
              <div className="w-80 h-80 bg-color-blob2 absolute top-0 -left-5 -z-11 blur-2xl opacity-30 overflow-hidden rounded-full"></div>

              <div className="w-80 h-80 bg-color-blob absolute bottom-10 right-0 -z-12 blur-2xl opacity-30 overflow-hidden rounded-full"></div>

              <div className="flex flex-col items-center justify-between md:flex-row">
                <div className="mb-12 md:w-1/2">
                  <img src="/img/landing-page/about.png" alt="" />
                </div>

                <div className="text-center md:text-left md:w-1/2 md:ml-20">
                  <h4 className="font-bold text-color-secondary mb-4">About</h4>
                  <h1 className="title mb-4">
                    Unveiling Excellence, Insights into Our Mission and Values.
                  </h1>
                  <p className="leading-relaxed mb-10">
                    The TIAS application with the implementation of gamification
                    based on the Tridharma of higher education is developed on
                    two platforms: web and mobile. The web platform is used for
                    the data input process of achievements obtained by students,
                    while the mobile platform is designed so that each student
                    can get information related to leaderboards, scores, and
                    levels they have achieved.
                  </p>
                  <a href="/register" target="_blank" className="btn">
                    Register
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section id="how-it-works" className="bg-color-primary-light">
            <div className="container py-20">
              <div className="text-center m-auto mb-20 md:w-1/2">
                <h4 className="font-bold text-color-secondary mb-4">
                  How It Works
                </h4>
                <h1 className="title">
                  Unlocking the Mechanism, Understanding How It Works.
                </h1>
              </div>

              <div className="flex flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0 md:space-x-6">
                <div className="text-center cursor-pointer">
                  <div className="relative bg-color-primary-dark inline-block px-6 py-3 rounded-lg cursor-pointer hover:bg-color-secondary ease-in duration-200">
                    <p className="text-6xl lg:after:content-[''] lg:after:flex lg:after:bg-[url('/img/landing-page/line.png')] lg:after:absolute lg:after:top-4 lg:after:left-32 2xl:after:left-52 lg:after:bg-no-repeat lg:after:h-7 lg:after:w-52">
                      1
                    </p>
                  </div>
                  <h3 className="text-xl font-bold py-4">Create an Account</h3>
                  <p className="leading-relaxed">
                    Start Your Journey. Create an Account Now!
                  </p>
                </div>

                <div className="text-center cursor-pointer">
                  <div className="relative inline-block px-6 py-3 rounded-lg cursor-pointer bg-color-secondary">
                    <p className="text-6xl lg:after:content-[''] lg:after:flex lg:after:bg-[url('/img/landing-page/line-bottom.png')] lg:after:absolute lg:after:top-10 lg:after:left-32 2xl:after:left-52 lg:after:bg-no-repeat lg:after:h-7 lg:after:w-52">
                      2
                    </p>
                  </div>
                  <h3 className="text-xl font-bold py-4">Setup Your Profile</h3>
                  <p className="leading-relaxed">
                    Optimize Your Presence. Complete Profile Setup!
                  </p>
                </div>
                <div className="text-center cursor-pointer">
                  <div className="relative bg-color-primary-dark inline-block px-6 py-3 rounded-lg cursor-pointer hover:bg-color-secondary ease-in duration-200">
                    <p className="text-6xl">3</p>
                  </div>
                  <h3 className="text-xl font-bold py-4">Enjoy The Game!</h3>
                  <p className="leading-relaxed">
                    Level Up Your Enjoyment. Let the Games Begin!
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* <section id="testimonial">
            <div className="container py-20">
              <div className="text-center m-auto mb-20 md:w-1/2">
                <h4 className="font-bold text-color-secondary mb-4">
                  User Review
                </h4>
                <h1 className="title">
                  What Clients Say About Our App After Use It
                </h1>
              </div>

              <div className="mt-8">
                <div className="flex items-center justify-center flex-wrap">
                  <img
                    src="/img/landing-page/user1.jpg"
                    alt=""
                    className="h-20 w-20 rounded-full p-1 m-3 cursor-pointer user-pic active-pic"
                    onClick="showReview()"
                  />
                  <img
                    src="/img/landing-page/user2.jpg"
                    alt=""
                    className="h-20 w-20 rounded-full p-1 m-3 cursor-pointer user-pic"
                    onClick="showReview()"
                  />
                  <img
                    src="/img/landing-page/user3.jpg"
                    alt=""
                    className="h-20 w-20 rounded-full p-1 m-3 cursor-pointer user-pic"
                    onClick="showReview()"
                  />
                  <img
                    src="/img/landing-page/user4.jpg"
                    alt=""
                    className="h-20 w-20 rounded-full p-1 m-3 cursor-pointer user-pic"
                    onClick="showReview()"
                  />
                  <img
                    src="/img/landing-page/user5.jpg"
                    alt=""
                    className="h-20 w-20 rounded-full p-1 m-3 cursor-pointer user-pic"
                    onClick="showReview()"
                  />
                </div>

                <div className="grid place-items-center text-center m-auto md:w-4/5 min-h-[40vh]">
                  <div className="user-text active-text">
                    <p className="md:text-2xl mb-6">
                      This should be used to tell a story and include any
                      testimonials you might have about your product or service
                      for your clients!
                    </p>
                    <h4 className="font-bold text-color-secondary mb-1">
                      Markin Nesus
                    </h4>
                    <p>IOS developer</p>
                  </div>

                  <div className="user-text">
                    <p className="md:text-2xl mb-6">
                      This should be used to tell a story and include any
                      testimonials you might have about your product or service
                      for your clients!
                    </p>
                    <h4 className="font-bold text-color-secondary mb-1">
                      Vera Duncan
                    </h4>
                    <p>Flutter developer</p>
                  </div>

                  <div className="user-text">
                    <p className="md:text-2xl mb-6">
                      This should be used to tell a story and include any
                      testimonials you might have about your product or service
                      for your clients!
                    </p>
                    <h4 className="font-bold text-color-secondary mb-1">
                      Pirtle Karol
                    </h4>
                    <p>Android developer</p>
                  </div>

                  <div className="user-text">
                    <p className="md:text-2xl mb-6">
                      This should be used to tell a story and include any
                      testimonials you might have about your product or service
                      for your clients!
                    </p>
                    <h4 className="font-bold text-color-secondary mb-1">
                      Mark Joe
                    </h4>
                    <p>React developer</p>
                  </div>

                  <div className="user-text">
                    <p className="md:text-2xl mb-6">
                      This should be used to tell a story and include any
                      testimonials you might have about your product or service
                      for your clients!
                    </p>
                    <h4 className="font-bold text-color-secondary mb-1">
                      Leila Domniuc
                    </h4>
                    <p>Angular developer</p>
                  </div>
                </div>
              </div>
            </div>
          </section> */}

          <section id="support" className="bg-color-primary-light">
            <div className="container py-20">
              <div className="text-center m-auto mb-20 md:w-1/2">
                <h4 className="font-bold text-color-secondary mb-4">Support</h4>
                <h1 className="title">need help? Or do you have suggestions for improving the app? Please share your feedback!</h1>
              </div>

                <Swiper effect={'coverflow'} grabCursor={true} slidesPerView={3} spaceBetween={30} coverflowEffect={{
                    "rotate": 50,
                    "stretch": 0,
                    "depth": 100,
                    "modifier": 1,
                    "slideShadows": true
                  }} pagination={{ clickable: true }} className="mySwiper">
                  <SwiperSlide>
                    <div className="card relative h-auto w-auto">
                      <div
                        id="card_1_front"
                        className="front px-7 py-11 rounded-2xl border-2 border-solid border-color-gray h-full w-full"
                      >
                        
                          <div className="md:w-80">
                            <img src="/img/wahyu.jpeg" alt="" className="rounded-2xl" />
                          </div>

                          <div className="py-10 text-center">
                            <h3 className="text-xl font-bold pb-3">Mobile Developer</h3>
                            <span className="text-md pb-3">Wahyu Ramadhan</span> <br />
                            <span className="text-md pb-3">+62 812-9894-8302</span>
                          </div>
                          
                          <button className="card_btn" onClick={() => { window.location.href = "https://api.whatsapp.com/send?phone=6281298948302"; }}>Contact Here</button>
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

                            <div className="py-10 text-center">
                              <h3 className="text-xl font-bold pb-3">Back-End Engineer</h3>
                              <span className="text-md pb-3">Muhammad Azis Pratama</span> <br />
                              <span className="text-md pb-3">+62 895-3491-39240</span>
                            </div>
                            
                            <button className="card_btn" onClick={() => { window.location.href = "https://api.whatsapp.com/send?phone=62895349139240"; }}>Contact Here</button>
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

                          <div className="py-10 text-center">
                            <h3 className="text-xl font-bold pb-3">Web Developer</h3>
                            <span className="text-md pb-3">Mochammad Tamam Mulya</span> <br />
                            <span className="text-md pb-3">+62 896-3818-7480</span>
                          </div>
                          <button className="card_btn" onClick={() => { window.location.href = "https://api.whatsapp.com/send?phone=6289638187480"; }}>Contact Here</button>
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

                          <div className="py-10 text-center">
                            <h3 className="text-xl font-bold pb-3">Web Developer</h3>
                            <span className="text-md pb-3">Mochammad Tamam Mulya</span> <br />
                            <span className="text-md pb-3">+62 896-3818-7480</span>
                          </div>
                          <button className="card_btn" onClick={() => { window.location.href = "https://api.whatsapp.com/send?phone=6289638187480"; }}>Contact Here</button>
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

                          <div className="py-10 text-center">
                            <h3 className="text-xl font-bold pb-3">Web Developer</h3>
                            <span className="text-md pb-3">Mochammad Tamam Mulya</span> <br />
                            <span className="text-md pb-3">+62 896-3818-7480</span>
                          </div>
                          <button className="card_btn" onClick={() => { window.location.href = "https://api.whatsapp.com/send?phone=6289638187480"; }}>Contact Here</button>
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

                          <div className="py-10 text-center">
                            <h3 className="text-xl font-bold pb-3">Web Developer</h3>
                            <span className="text-md pb-3">Mochammad Tamam Mulya</span> <br />
                            <span className="text-md pb-3">+62 896-3818-7480</span>
                          </div>
                          <button className="card_btn" onClick={() => { window.location.href = "https://api.whatsapp.com/send?phone=6289638187480"; }}>Contact Here</button>
                      </div>
                    </div>
                  </SwiperSlide>
                </Swiper>
                
            </div>
          </section>

          {/* <section id="blog">
            <div className="container py-20">
              <div className="text-center m-auto mb-20 md:w-1/2">
                <h4 className="font-bold text-color-secondary mb-4">
                  Innovation And Quality Improvement
                </h4>
                <h1 className="title">
                  Latest Updates, Solutions And Company News
                </h1>
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
                      enterprises worldwide, supply chain control is
                      everything...
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
                      Our team provides skilled & experienced managers who know
                      the intricacies of this vertical and focus...
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
          </section> */}

          <section id="download-app" className="bg-color-primary-light">
            <div className="container h-[80vh] grid place-items-center">
              <div className="text-center md:w-2/3 m-auto">
                <h1 className="title">Download The Application Now and Check Your Rank.</h1>
                <p className="leading-relaxed pt-5">
                Explore the app, climb the ranks, and track your progress!
                </p>

                <div className="flex flex-col md:flex-row items-center justify-center gap-5 pt-10">
                  {/* <a
                    href="#"
                    className="bg-color-white h-16 w-44 grid place-items-center rounded-lg hover:opacity-70"
                  >
                    <img src="/img/landing-page/ios-store-dark.png" alt="" />
                  </a> */}
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
{/* 
          <section id="contact">
            <div className="container py-20">
              <div className="text-center m-auto mb-20 md:w-1/2">
                <h4 className="font-bold text-color-secondary mb-4">
                  Have A Questation
                </h4>
                <h1 className="title">Get In Touch</h1>
              </div>

              <form>
                <div className="w-full m-auto text-center md:w-2/3">
                  <div className="text-color-primary-dark grid gap-6 mb-6 md:grid-cols-2">
                    <input
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-3 focus:outline-none focus:border-color-secondary"
                      placeholder="Name"
                    />

                    <input
                      type="email"
                      className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-3 focus:outline-none focus:border-color-secondary"
                      placeholder="Email"
                    />

                    <input
                      type="tel"
                      className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-3 focus:outline-none focus:border-color-secondary"
                      placeholder="Phone"
                    />

                    <input
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-3 focus:outline-none focus:border-color-secondary"
                      placeholder="Company"
                    />
                  </div>

                  <textarea
                    rows="4"
                    className="text-color-primary-dark bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-3 focus:outline-none focus:border-color-secondary"
                    placeholder="Message"
                  ></textarea>

                  <button className="btn mt-10">Send Message</button>
                </div>
              </form>
            </div>
          </section> */}

          <section id="footer">
            <div className="bg-color-primary-dark relative">
              <div className="container py-10">
                <div className="grid gap-10 md:grid-cols-3 pb-10">
                  <div className="space-y-6">
                    <h4 className="font-bold text-lg">About App</h4>
                    <p className="leading-relaxed">
                    The TIAS application with the implementation of gamification based on the Tridharma of higher education is developed on two platforms: web and mobile.
                    </p>
                    {/* <div className="flex gap-5 items-center">
                      <p>Follow Us</p>
                      <Icon
                        icon="ri:facebook-fill"
                        class="cursor-pointer hover:text-color-secondary"
                      />
                      <Icon
                        icon="bi:youtube"
                        class="cursor-pointer hover:text-color-secondary"
                      />
                      <Icon
                        icon="fa:instagram"
                        class="cursor-pointer hover:text-color-secondary"
                      />
                      <i className="fa-brands fa-facebook-f cursor-pointer hover:text-color-secondary"></i>
                      <i className="fa-brands fa-twitter cursor-pointer hover:text-color-secondary"></i>
                      <i className="fa-brands fa-youtube cursor-pointer hover:text-color-secondary"></i>
                      <i className="fa-brands fa-instagram cursor-pointer hover:text-color-secondary"></i>
                    </div> */}
                  </div>
                  <div className="flex justify-between md:justify-around">
                    <div className="space-y-6">
                      <h4 className="font-bold text-lg">Quick Links</h4>
                      <ul className="space-y-3">
                        <li className="underline hover:no-underline hover:text-color-secondary">
                          <a href="#">Home</a>
                        </li>
                        <li className="underline hover:no-underline hover:text-color-secondary">
                          <a href="#gamification">Gamification</a>
                        </li>
                        <li className="underline hover:no-underline hover:text-color-secondary">
                          <a href="#about">ABout</a>
                        </li>
                        <li className="underline hover:no-underline hover:text-color-secondary">
                          <a href="#support">Support</a>
                        </li>
                        {/* <li className="underline hover:no-underline hover:text-color-secondary">
                          <a href="#pricing">Pricing</a>
                        </li>
                        <li className="underline hover:no-underline hover:text-color-secondary">
                          <a href="#blog">Blog</a>
                        </li>
                        <li className="underline hover:no-underline hover:text-color-secondary">
                          <a href="#contact">Contact</a>
                        </li> */}
                      </ul>
                    </div>

                    {/* <div className="space-y-6">
                      <h4 className="font-bold text-lg">Help</h4>
                      <ul className="space-y-3">
                        <li className="underline hover:no-underline hover:text-color-secondary">
                          <a href="#">About Us</a>
                        </li>
                        <li className="underline hover:no-underline hover:text-color-secondary">
                          <a href="#gamification">Partners</a>
                        </li>
                        <li className="underline hover:no-underline hover:text-color-secondary">
                          <a href="#testimonial">Career</a>
                        </li>
                        <li className="underline hover:no-underline hover:text-color-secondary">
                          <a href="#pricing">Reviews</a>
                        </li>
                        <li className="underline hover:no-underline hover:text-color-secondary">
                          <a href="#blog">Terms & Conditions</a>
                        </li>
                        <li className="underline hover:no-underline hover:text-color-secondary">
                          <a href="#contact">Help</a>
                        </li>
                      </ul>
                    </div> */}
                  </div>
                  <div className="space-y-6">
                    {/* <h4 className="font-bold text-lg">Newsletter</h4>
                    <p className="leading-relaxed">
                      Subscribe With Email And Loads Of News Will Be Sent To You
                    </p> */}
                    <div className="flex items-center">
                      <img src="/img/landing-page/ti-logo.png" alt="" />
                      <img src="/img/landing-page/himatekinfo-logo.png" alt="" />
                      
                    </div>
                  </div>
                </div>

                <div className="flex justify-center pt-10 border-t border-color-gray">
                  <p>2024 &copy; TIAS. All Rights Reserved.</p> 
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Home;
