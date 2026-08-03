import { NextResponse } from "next/server";
import { getIronSession } from "iron-session/edge";
import { sessionConfig } from "./config/session";

export const middleware = async (req) => {
  const response = NextResponse.next();
  const url = req.nextUrl;

  console.log("RAW COOKIE:", req.cookies.get("tias_staging_session"));
  console.log("SESSION PASSWORD LOADED:", sessionConfig.password ? "YES-" + sessionConfig.password.length + "chars" : "MISSING");
  try {
    const { unsealData } = await import("iron-session/edge");
    const rawVal = req.cookies.get("tias_staging_session")?.value;
    if (rawVal) {
      const unsealed = await unsealData(rawVal, { password: sessionConfig.password });
      console.log("UNSEAL RESULT:", JSON.stringify(unsealed));
    }
  } catch (e) {
    console.log("UNSEAL ERROR:", e.message);
  }
  const session = await getIronSession(req, response, sessionConfig);

  const { user } = session;
  console.log("MIDDLEWARE SESSION USER:", user);

  // Staging & prod share one domain, split by this path prefix at the proxy.
  // Any redirect built without it escapes staging's proxy scope and lands on prod.
  const STAGING_PREFIX = "/staging";

  const universalRoute = [
    "/",
    "/register",
    "/register-pmm",
    "/forgot-password",
    "/validasi-dokumen",
    "/validasi-surat",
    "/register-dosen-ext",
    "/register-pegawai",
    "/oauth/callback",
  ].map((route) => STAGING_PREFIX + route);

  const protectedRoute = ["/login", "/auth/verify"].map(
    (route) => STAGING_PREFIX + route
  );
  if (user == null && universalRoute.includes(url.pathname)) return response;

  if (url.pathname.startsWith(`${STAGING_PREFIX}/validasi-dokumen`))
    return response;
  if (url.pathname.startsWith(`${STAGING_PREFIX}/validasi-surat`))
    return response;

  if (user == null && url.pathname.startsWith(`${STAGING_PREFIX}/resetPassword`))
    return response;

  if (user == null && url.pathname.startsWith(`${STAGING_PREFIX}/verification`))
    return response;

  if (user == null && !protectedRoute.includes(url.pathname))
    return NextResponse.redirect(new URL(`${STAGING_PREFIX}/login`, req.url));

  if (
    user?.role == "Dosen" &&
    url.pathname.startsWith(`${STAGING_PREFIX}/dosen`) === false &&
    !universalRoute.includes(url.pathname)
  )
    return NextResponse.redirect(new URL(`${STAGING_PREFIX}/dosen`, req.url));
  if (
    user?.role == "Demo" &&
    url.pathname.startsWith(`${STAGING_PREFIX}/demo`) === false &&
    !universalRoute.includes(url.pathname)
  )
    return NextResponse.redirect(new URL(`${STAGING_PREFIX}/demo`, req.url));

  if (
    user?.role == "Dosen_Ext" &&
    url.pathname.startsWith(`${STAGING_PREFIX}/dosen_ext`) === false &&
    !universalRoute.includes(url.pathname)
  )
    return NextResponse.redirect(new URL(`${STAGING_PREFIX}/dosen_ext`, req.url));
  if (
    user?.role == "Mahasiswa" &&
    url.pathname.startsWith(`${STAGING_PREFIX}/mahasiswa`) === false &&
    !universalRoute.includes(url.pathname)
  )
    return NextResponse.redirect(new URL(`${STAGING_PREFIX}/mahasiswa`, req.url));

  if (
    user?.role == "Admin" &&
    url.pathname.startsWith(`${STAGING_PREFIX}/admin`) === false &&
    !universalRoute.includes(url.pathname)
  )
    return NextResponse.redirect(new URL(`${STAGING_PREFIX}/admin`, req.url));

  if (
    user?.role == "Pegawai" &&
    url.pathname.startsWith(`${STAGING_PREFIX}/pegawai`) === false &&
    !universalRoute.includes(url.pathname)
  )
    return NextResponse.redirect(new URL(`${STAGING_PREFIX}/pegawai`, req.url));

  if (
    user?.role == "Parent" &&
    url.pathname.startsWith(`${STAGING_PREFIX}/parent`) === false &&
    !universalRoute.includes(url.pathname)
  )
    return NextResponse.redirect(
      new URL(`${STAGING_PREFIX}/parent/persuratan`, req.url)
    );

  return response;
};

export const config = {
  matcher: "/((?!api|static|favicon.ico|_next/static|img|icon).*)",
};
