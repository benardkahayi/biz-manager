export { auth as proxy } from "./auth"

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/products/:path*",
    "/stock/:path*",
    "/sales/:path*",
    "/expenses/:path*",
  ],
}