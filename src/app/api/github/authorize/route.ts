import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: "GitHub OAuth 未配置" },
      { status: 500 },
    );
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/github/callback`;
  const scope = "repo user:email";

  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", scope);
  url.searchParams.set("state", crypto.randomUUID());

  return NextResponse.redirect(url.toString());
}
