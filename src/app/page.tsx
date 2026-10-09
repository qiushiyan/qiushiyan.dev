import Link from "next/link";
import { SiGithub, SiLinkedin, SiX } from "@icons-pack/react-simple-icons";

import { PageShell } from "@/components/page-shell";
import { PostList } from "@/components/post/post-list";
import { FeaturedProjects } from "@/components/projects/featured-projects";
import { getPosts } from "@/lib/content/posts";
import { routes } from "@/lib/navigation";
import { siteConfig } from "@/lib/site";

const social = [
  { href: siteConfig.links.github, label: "GitHub", Icon: SiGithub },
  { href: siteConfig.links.x, label: "X", Icon: SiX },
  { href: siteConfig.links.linkedin, label: "LinkedIn", Icon: SiLinkedin },
];

export default function Home() {
  const posts = getPosts().slice(0, 5);

  return (
    <PageShell>
      <header>
        <h1 className="text-2xl/8 font-semibold tracking-tight">
          {siteConfig.name}
        </h1>
        <p className="mt-3 text-base/7 text-pretty text-muted-foreground">
          I&apos;m a full-stack engineer working on LLM-related products. I
          write about web development, data tooling and programming languages.
        </p>
        {/* -ml-3 keeps the first glyph on the column edge despite the 44px hit area. */}
        <ul aria-label="Elsewhere" className="mt-4 -ml-3 flex">
          {social.map(({ href, label, Icon }) => (
            <li key={href}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="grid size-11 place-items-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
              >
                <Icon aria-hidden className="size-5" />
                <span className="sr-only">{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </header>

      <section aria-labelledby="home-posts" className="mt-12">
        <div className="flex items-baseline justify-between gap-4">
          <h2
            id="home-posts"
            className="text-sm font-medium text-muted-foreground"
          >
            Posts
          </h2>
          <Link
            href={routes.posts}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            All posts
          </Link>
        </div>
        <PostList posts={posts} headingLevel={3} className="mt-4" />
      </section>

      <section aria-labelledby="home-projects" className="mt-12">
        <h2
          id="home-projects"
          className="text-sm font-medium text-muted-foreground"
        >
          Projects
        </h2>
        <FeaturedProjects />
      </section>
    </PageShell>
  );
}
