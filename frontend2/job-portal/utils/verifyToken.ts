// utils/verifyToken.ts

import { getToken } from "next-auth/jwt";

export async function verifyToken(req: Request) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  return token?.sub || null; // Or return token?.role or token?.email
}
