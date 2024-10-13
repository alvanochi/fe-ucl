import { Icon } from "@iconify-icon/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const HeaderOnPage = () => {
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector("header");
      const sectionn = document.querySelectorAll("section");
      const navlinkss = document.querySelectorAll("nav ul li a");

      // if (window.scrollY > 100) {
      //   navbar.classList.add("bg-color-primary-dark", "border-b");
      // } else {
      //   navbar.classList.remove("bg-color-primary-dark", "border-b");
      // }

      // active link
      let current = "validasi-dokumen";

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

    if (menu) {
      menu.classList.toggle("hidden");
    }
  };

  const handleLinkClick = () => {
    const menu = document.querySelector("#menu");

    if (menu) {
      menu.classList.add("hidden");
    }
  };
  return (
    <header
      className={`sticky top-0 z-50 bg-color-primary-dark border-b border-color-gray`}
    >
      <nav className="container flex justify-between items-center">
        <div className="py-5 text-color-secondary font-bold text-3xl">
          <Link href="/">
            <img src="/img/landing-page/logo-tias.png" alt="" width="170" />
          </Link>
        </div>
        <div>
          <ul className="hidden lg:flex items-center space-x-6">
            <li>
              <Link
                href="/"
                className="hover:text-color-secondary ease-in duration-200"
                onClick={handleLinkClick}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="hover:text-color-secondary ease-in duration-200"
                onClick={handleLinkClick}
              >
                Gamification
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="hover:text-color-secondary ease-in duration-200"
                onClick={handleLinkClick}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                id="hLink"
                href="/"
                className="hover:text-color-secondary ease-in duration-200"
                onClick={handleLinkClick}
              >
                Support
              </Link>
            </li>
            <li>
              <Link
                href="/validasi-dokumen"
                className="text-color-secondary  ease-in duration-200"
              >
                Validasi Dokumen
              </Link>
            </li>

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
              <Link
                id="hLink"
                href="/"
                className="hover:text-color-secondary ease-in duration-200"
                onClick={handleLinkClick}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                id="hLink"
                href="/"
                className="hover:text-color-secondary ease-in duration-200"
                onClick={handleLinkClick}
              >
                Gamification
              </Link>
            </li>
            <li>
              <Link
                id="hLink"
                href="/"
                className="hover:text-color-secondary ease-in duration-200"
                onClick={handleLinkClick}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                id="hLink"
                href="/"
                className="hover:text-color-secondary ease-in duration-200"
                onClick={handleLinkClick}
              >
                Support
              </Link>
            </li>
            <li>
              <Link
                href="/validasi-dokumen"
                className="text-color-secondary ease-in duration-200"
              >
                Validasi Dokumen
              </Link>
            </li>

            <li>
              <Link href="/login" className="btn">
                Dashboard
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default HeaderOnPage;
