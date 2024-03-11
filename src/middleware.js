import { NextResponse } from "next/server";
import { getIronSession } from "iron-session/edge";
import { sessionConfig } from "./config/session";

export const middleware = async (req) => {
  const response = NextResponse.next();
  const url = req.nextUrl;

  const session = await getIronSession(req, response, sessionConfig);

  const { user } = session;

  const universalRoute = [
    "/",
    "/register",
    "/register-pmm",
    "/forgot-password",
  ];

  // const universalRouteId = ["/resetPassword"]
  const protectedRoute = ["/login", "/auth/verify"];
  if (user == null && universalRoute.includes(url.pathname)) return response;

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

  return response;
};

export const config = {
  matcher: "/((?!api|static|favicon.ico|_next/static|img|icon).*)",
};
