import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser, createSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(new URL("/?error=github_auth_failed", req.url));
  }

  // Exchange code for access token
  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    return NextResponse.redirect(new URL("/?error=github_token_failed", req.url));
  }

  // Get GitHub user info
  const userRes = await fetch("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const ghUser = await userRes.json();

  const currentUser = await getCurrentUser();

  if (currentUser) {
    // Link GitHub to existing user
    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        githubId: String(ghUser.id),
        githubLogin: ghUser.login,
        avatarUrl: ghUser.avatar_url,
      },
    });
  } else {
    // Create or find user by GitHub ID
    let user = await prisma.user.findUnique({
      where: { githubId: String(ghUser.id) },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          githubId: String(ghUser.id),
          githubLogin: ghUser.login,
          name: ghUser.name || ghUser.login,
          avatarUrl: ghUser.avatar_url,
        },
      });
    }

    await createSession(user.id);
  }

  // Store access token temporarily for PR operations
  // In production, encrypt and store in DB
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  return NextResponse.redirect(new URL("/?github=connected", baseUrl));
}
