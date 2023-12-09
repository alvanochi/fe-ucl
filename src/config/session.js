export const sessionConfig = {
  cookieName: "tias_session_cookie",
  password: process.env.SESSION_SECRET_KEY,
  cookieOptions: {
    secure: false,
  },
};
