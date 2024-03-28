import { Icon } from "@iconify-icon/react";
import Link from "next/link";
import React, { useState } from "react";

export const Header = () => {
  const [isSticky, setSticky] = useState(false);

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
                onClick={handleLinkClick}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#gamification"
                className="hover:text-color-secondary ease-in duration-200"
                onClick={handleLinkClick}
              >
                Gamification
              </a>
            </li>
            <li>
              <a
                href="#about"
                className="hover:text-color-secondary ease-in duration-200"
                onClick={handleLinkClick}
              >
                About
              </a>
            </li>
            <li>
              <a
                id="hLink"
                href="#support"
                className="hover:text-color-secondary ease-in duration-200"
                onClick={handleLinkClick}
              >
                Supports
              </a>
            </li>
            <li>
              <Link
                href="/validasi-dokumen"
                className="hover:text-color-secondary ease-in duration-200"
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
              <a
                id="hLink"
                href="#home"
                className="hover:text-color-secondary ease-in duration-200"
                onClick={handleLinkClick}
              >
                Home
              </a>
            </li>
            <li>
              <a
                id="hLink"
                href="#gamification"
                className="hover:text-color-secondary ease-in duration-200"
                onClick={handleLinkClick}
              >
                Gamification
              </a>
            </li>
            <li>
              <a
                id="hLink"
                href="#about"
                className="hover:text-color-secondary ease-in duration-200"
                onClick={handleLinkClick}
              >
                About
              </a>
            </li>
            <li>
              <a
                id="hLink"
                href="#support"
                className="hover:text-color-secondary ease-in duration-200"
                onClick={handleLinkClick}
              >
                Supports
              </a>
            </li>
            <li>
              <Link
                href="/validasi-dokumen"
                className="hover:text-color-secondary ease-in duration-200"
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
