import React from "react";

export const TestiMonials = () => {
  const handleReviewClick = (event) => {
    const userPics = document.getElementsByClassName("user-pic");
    const userTexts = document.getElementsByClassName("user-text");

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

  const handleReviewClickDsn = (event) => {
    const userPics = document.getElementsByClassName("user-pic");
    const userTexts = document.getElementsByClassName("user-text");

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

  return (
    <section id="support">
      <div className="container py-20">
        <div className="text-center m-auto mb-20 md:w-1/2">
          <h4 className="font-bold text-color-secondary mb-4">Support</h4>
          <h1 className="title text-primary-700">
            need help? Or do you have suggestions for improving the app? Please
            share your feedback!
          </h1>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-center flex-wrap">
            <img
              src="/img/bpk_fitrah.jpeg"
              alt=""
              className="h-20 w-20 rounded-full p-1 m-3 cursor-pointer user-pic active-pic"
              onClick={handleReviewClickDsn}
            />
            <img
              src="/img/bpk_safar.JPG"
              alt=""
              className="h-20 w-20 rounded-full p-1 m-3 cursor-pointer user-pic"
              onClick={handleReviewClickDsn}
            />
            <img
              src="/img/azis.jpg"
              alt=""
              className="h-20 w-20 rounded-full p-1 m-3 cursor-pointer user-pic"
              onClick={handleReviewClick}
            />
            <img
              src="/img/wahyu.jpeg"
              alt=""
              className="h-20 w-20 rounded-full p-1 m-3 cursor-pointer user-pic"
              onClick={handleReviewClick}
            />
            <img
              src="/img/tamam.jpeg"
              alt=""
              className="h-20 w-20 rounded-full p-1 m-3 cursor-pointer user-pic"
              onClick={handleReviewClick}
            />
          </div>

          <div className="grid place-items-center text-center m-auto md:w-4/5 min-h-[10vh]">
            <div className="user-text active-text">
              <h4 className="font-bold text-color-secondary mb-1">
                Fitrah Satrya Fajar Kusumah, S.Kom, M.Kom.
              </h4>
              <p className="text-primary-700">Project Manager</p>
            </div>
            <div className="user-text ">
              <h4 className="font-bold text-color-secondary mb-1">
                Safaruddin Hidayat Al Ikhsan, S.Kom, M.Kom.
              </h4>
              <p className="text-primary-700">Sistem Analis</p>
            </div>
            <div className="user-text ">
              <h4 className="font-bold text-color-secondary mb-1">
                Muhammad Azis pratama
              </h4>
              <p className="text-primary-700">Back-End Engineer</p>
            </div>

            <div className="user-text">
              <h4 className="font-bold text-color-secondary mb-1">
                Wahyu Ramadhan
              </h4>
              <p className="text-primary-700">Android Developer</p>
            </div>

            <div className="user-text">
              <h4 className="font-bold text-color-secondary mb-1">
                Mochammad Tamam Mulya
              </h4>
              <p className="text-primary-700">Web Developer</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-center flex-wrap"></div>

          <div className="grid place-items-center text-center m-auto md:w-4/5 min-h-[10vh]"></div>
        </div>
      </div>
    </section>
  );
};
