import { NextResponse } from "next/server";
import axios from "axios";

export async function middleware(request) {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  console.log("Middleware triggered with pathname:", request.nextUrl.pathname);

  const sessionCookie = request.cookies.get("sessionData");
  const { pathname } = request.nextUrl;

  // Allow specific routes without authentication
  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/confirmation" ||
    pathname === "/verification" ||
    pathname === "/complete_signup"
  ) {
    console.log("No session required for this route:", pathname);
    return NextResponse.next();
  }

  // Redirect to login if no session cookie exists
  if (!sessionCookie) {
    console.log("No session cookie, redirecting to login.");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Verify session with backend
    console.log("Verifying session with backend...");
    const authUser = await axios.get(`${BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${sessionCookie.value}` },
    });

    if (authUser) {
      console.log("Session verified, proceeding with request.");
      const response = NextResponse.next();

      // Encode user data and set custom header
      const encodedMessage = Buffer.from(
        JSON.stringify(authUser.data)
      ).toString("base64");

      response.headers.set("x-auth-user", encodedMessage);
      return response;
    } else {
      console.log("Session invalid, redirecting to login.");
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } catch (error) {
    console.log("Error verifying session, redirecting to login:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  // Matcher to avoid applying middleware to API and static requests
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
