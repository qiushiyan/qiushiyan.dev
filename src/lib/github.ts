import { GITHUB_TOKEN } from "astro:env/server";

export type RepoStats = {
  description: string | null;
  stars: number;
};

/**
 * Description and star count of a public GitHub repository, or `null` when the
 * request fails for any reason (rate limit, renamed repo, no network).
 * `GITHUB_TOKEN` is optional; it only raises the rate limit. Pages that call
 * this are prerendered, so it runs once per build.
 */
export async function getRepoStats(fullName: string): Promise<RepoStats | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${fullName}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "qiushiyan.dev",
        ...(GITHUB_TOKEN && { Authorization: `Bearer ${GITHUB_TOKEN}` }),
      },
      // A slow API should cost the build a few seconds, not hang it.
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const repo = (await res.json()) as {
      description?: string | null;
      stargazers_count?: number;
    };
    return {
      description: repo.description ?? null,
      stars: repo.stargazers_count ?? 0,
    };
  } catch {
    return null;
  }
}
