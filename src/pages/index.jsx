import Head from "next/head";
import { useEffect, useState } from "react";
import { Icon } from "@iconify-icon/react";
import Link from "next/link";

import { About } from "../components/LandingPage/About";
import { Gamification } from "../components/LandingPage/Gamification";
import { HowItWorks } from "../components/LandingPage/HowItWorks";
import { Blog } from "../components/LandingPage/Blog";
import { DownloadApp } from "../components/LandingPage/DownloadApp";
import { Contact } from "../components/LandingPage/Contact";
import { Footer } from "../components/LandingPage/Footer";
import { TestiMonials } from "../components/LandingPage/TestiMonials";
import { Support } from "../components/LandingPage/Support";
import { Hero } from "../components/LandingPage/Hero";
import { Header } from "../components/LandingPage/Header";

const Home = () => {
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

  return (
    <>
      <Head>
        <title>UCL</title>
      </Head>
      <div className="bg-color-primary text-color-white tracking-wider">
        <Header />

        <main>
          <Hero />
          <Gamification />
          <About />
          <HowItWorks />
          <TestiMonials />
          {/* <Support />
          <Blog /> */}
          <DownloadApp />
          {/* <Contact /> */}
          <Footer />
        </main>
      </div>
    </>
  );
};

export default Home;
