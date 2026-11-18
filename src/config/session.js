export const sessionConfig = {
  cookieName: "tias_staging_session",
  password: process.env.SESSION_SECRET_KEY,
  cookieOptions: {
    secure: true,
    sameSite: "lax",
  },
};
