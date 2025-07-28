// utils/verifyToken.ts
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function verifyToken(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  return token?.sub || null; // or return token?.email or token?.role as needed
}
