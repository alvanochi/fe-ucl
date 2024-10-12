import React from "react";

export const Footer = () => {
  return (
    <section id="footer">
      <div className="bg-color-primary-dark relative">
        <div className="container py-10">
          <div className="grid gap-10 md:grid-cols-3 pb-10">
            <div className="space-y-6">
              <h4 className="font-bold text-lg">About App</h4>
              <p className="leading-relaxed">
                The UCL application with the implementation of gamification
                based on the Tridharma of higher education is developed on two
                platforms: web and mobile.
              </p>
              {/* <div className="flex gap-5 items-center">
                      <p>Follow Us</p>
                      <Icon
                        icon="ri:facebook-fill"
                        className="cursor-pointer hover:text-color-secondary"
                      />
                      <Icon
                        icon="bi:youtube"
                        className="cursor-pointer hover:text-color-secondary"
                      />
                      <Icon
                        icon="fa:instagram"
                        className="cursor-pointer hover:text-color-secondary"
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
                <img src="/img/landing-page/ti-logo.png" alt="" width={80} />
                <img
                  src="/img/landing-page/himatekinfo-logo.png"
                  alt=""
                  width={80}
                />
                <img
                  src="/img/landing-page/logo-uika.png"
                  alt=""
                  className="ml-2"
                  width={80}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-10 border-t border-color-gray">
            <p>2024 &copy; UCL. All Rights Reserved.</p>
            <span className="ml-40"> Powered By TIAS</span>
          </div>
        </div>
      </div>
    </section>
  );
};
