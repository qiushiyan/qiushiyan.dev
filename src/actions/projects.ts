"use server";

import { memoize } from "nextjs-better-unstable-cache";
import { Octokit } from "octokit";

import { isProduction } from "@/constants";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export const getProject = memoize(
  async (repo: string) => {
    const [owner, repoName] = repo.split("/");
    return octokit.rest.repos.get({ owner, repo: repoName });
  },
  {
    // log: isProduction ? undefined : ["dedupe", "datacache", "verbose"],
    revalidateTags: (repo: string) => ["get-project", repo],
    // logid: "get-project",
    persist: true,
    duration: 60 * 60,
  }
);

export const getProjects = memoize(
  async (repos: string[]) => {
    const results = await Promise.all(repos.map((repo) => getProject(repo)));
    return results;
  },
  {
    // log: isProduction ? undefined : ["dedupe", "datacache", "verbose"],
    revalidateTags: ["get-projects"],
    // logid: "get-projects",
    persist: true,
    duration: 60 * 60,
  }
);
