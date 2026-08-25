const crypto = require("crypto");

const ACCESS_COOKIE = "vesta_access_token";
const REFRESH_COOKIE = "vesta_refresh_token";

const cookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: process.env.COOKIE_SECURE === "true",
  sameSite: "lax",
  maxAge,
  path: "/",
});

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const getCookie = (req, name) => {
  const cookies = req.headers.cookie || "";
  const match = cookies.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

const clearAuthCookies = (res) => {
  res.clearCookie(ACCESS_COOKIE, cookieOptions(0));
  res.clearCookie(REFRESH_COOKIE, cookieOptions(0));
};

module.exports = {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  cookieOptions,
  hashToken,
  getCookie,
  clearAuthCookies,
};
