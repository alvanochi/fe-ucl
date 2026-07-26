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
  ];

  // const universalRouteId = ["/resetPassword"]
  const protectedRoute = ["/login", "/auth/verify"];
  if (user == null && universalRoute.includes(url.pathname)) return response;

  if (url.pathname.startsWith("/validasi-dokumen") === true) return response;
  if (url.pathname.startsWith("/validasi-surat") === true) return response;

  if (user == null && url.pathname.startsWith("/resetPassword") === true)
    return response;

  if (user == null && url.pathname.startsWith("/verification") === true)
    return response;

  if (user == null && !protectedRoute.includes(url.pathname))
    return NextResponse.redirect(new URL("/login", req.url));

  if (
    user?.role == "Dosen" &&
    url.pathname.startsWith("/dosen") === false &&
    !universalRoute.includes(url.pathname)
  )
    return NextResponse.redirect(new URL("/dosen", req.url));
  if (
    user?.role == "Demo" &&
    url.pathname.startsWith("/demo") === false &&
    !universalRoute.includes(url.pathname)
  )
    return NextResponse.redirect(new URL("/demo", req.url));

  if (
    user?.role == "Dosen_Ext" &&
    url.pathname.startsWith("/dosen_ext") === false &&
    !universalRoute.includes(url.pathname)
  )
    return NextResponse.redirect(new URL("/dosen_ext", req.url));
  if (
    user?.role == "Mahasiswa" &&
    url.pathname.startsWith("/mahasiswa") === false &&
    !universalRoute.includes(url.pathname)
  )
    return NextResponse.redirect(new URL("/mahasiswa", req.url));

  if (
    user?.role == "Admin" &&
    url.pathname.startsWith("/admin") === false &&
    !universalRoute.includes(url.pathname)
  )
    return NextResponse.redirect(new URL("/admin", req.url));

  if (
    user?.role == "Pegawai" &&
    url.pathname.startsWith("/pegawai") === false &&
    !universalRoute.includes(url.pathname)
  )
    return NextResponse.redirect(new URL("/pegawai", req.url));

  if (
    user?.role == "Parent" &&
    url.pathname.startsWith("/parent") === false &&
    !universalRoute.includes(url.pathname)
  )
    return NextResponse.redirect(new URL("/parent/persuratan", req.url));

  return response;
};

export const config = {
  matcher: "/((?!api|static|favicon.ico|_next/static|img|icon).*)",
};
