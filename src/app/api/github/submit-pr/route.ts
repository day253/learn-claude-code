import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const PRACTICE_REPO_OWNER = "prschool";
const PRACTICE_REPO_NAME = "playground";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  if (!user.githubLogin) {
    return NextResponse.json(
      { error: "请先绑定 GitHub 账号" },
      { status: 400 },
    );
  }

  const { prUrl } = await req.json();
  if (!prUrl) {
    return NextResponse.json({ error: "缺少 PR URL" }, { status: 400 });
  }

  // Parse PR URL: https://github.com/owner/repo/pull/123
  const prMatch = prUrl.match(
    /github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/,
  );
  if (!prMatch) {
    return NextResponse.json({ error: "PR URL 格式不正确" }, { status: 400 });
  }

  const [, repoOwner, repoName, prNumberStr] = prMatch;
  const prNumber = parseInt(prNumberStr);

  // Verify PR targets our practice repo
  if (
    repoOwner !== PRACTICE_REPO_OWNER ||
    repoName !== PRACTICE_REPO_NAME
  ) {
    return NextResponse.json(
      {
        error: `PR 必须提交到 ${PRACTICE_REPO_OWNER}/${PRACTICE_REPO_NAME} 仓库`,
      },
      { status: 400 },
    );
  }

  // Save graduation PR record
  const graduation = await prisma.graduationPR.create({
    data: {
      userId: user.id,
      prUrl,
      prNumber,
      repoOwner,
      repoName,
      status: "pending",
    },
  });

  // TODO: In production, trigger auto-review via GitHub Actions webhook
  // The GitHub Actions workflow in the practice repo will:
  // 1. Verify the PR author matches the registered user
  // 2. Check PR format (title, description, file changes)
  // 3. Auto-approve and merge if all checks pass
  // 4. Call back to /api/github/pr-merged to update status

  return NextResponse.json({
    id: graduation.id,
    status: "pending",
    message: "PR 已提交审核，请等待自动审核结果",
  });
}
