import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/journal/:path*",
    "/analytics/:path*",
    "/strategies/:path*",
    "/risk/:path*",
    "/ai-coach/:path*",
    "/replay/:path*",
  ],
};
