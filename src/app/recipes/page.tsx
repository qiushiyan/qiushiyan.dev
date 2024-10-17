import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { SiteNav } from "@/components/nav/site-nav";
import { getNotes } from "@/lib/content/notes";
import { routes } from "@/lib/navigation";
import { noteViewTransitionName, recipeViewTransitionName } from "@/lib/utils";
import { recipes } from "#content";
import { Link } from "next-view-transitions";

import { bgPattern } from "./patterns";

export default function RecipesPage() {
  return (
    <>
      <SiteNav />
      <Container>
        <div className="grid gap-12 lg:gap-24">
          <section aria-labelledby="recipes-heading">
            <Heading id="recipes-heading">Recipes</Heading>
            <p className="text-muted-foreground">
              Miscellaneous code snippets in various languages and frameworks.
              You are welcome to copy and use them however you like.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4">
              {Object.entries(recipes).map(([key, recipe]) => (
                <div key={key} className="space-y-4">
                  <h3 className="text-xl font-medium capitalize lg:text-2xl">
                    {key}
                  </h3>
                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {recipe.map((item) => (
                      <RecipeCard
                        key={item.title}
                        title={item.title}
                        slug={item.slug}
                        lang={key}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="notes-heading">
            <Heading id="notes-heading">Notes</Heading>
            <p className="text-muted-foreground">
              My personal notes on books, courses, etc. Warning: they can be
              contextless and does not make sense to anyone but me, or maybe not
              even to me a month later.
            </p>
            <ul className="mt-4 flex flex-col gap-4">
              {getNotes().map((note) => (
                <li key={note.href}>
                  <Link
                    href={note.href}
                    className="underline underline-offset-4"
                  >
                    <h3
                      className="text-lg font-medium tracking-tight lg:text-xl"
                      style={{
                        viewTransitionName: noteViewTransitionName(note.slug),
                      }}
                    >
                      {note.title}
                    </h3>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </Container>
    </>
  );
}

function RecipeCard({
  title,
  slug,
  lang,
}: {
  title: string;
  slug: string;
  lang: string;
}) {
  return (
    <Link href={routes.recipe(lang, slug)}>
      <div className="grid min-h-64 grid-cols-1 grid-rows-[80%_20%]">
        <div
          className="col-start-1 row-span-full"
          style={bgPattern("#9C92AC", 0.8)}
        />
        <div className="col-start-1 row-start-2 row-end-3 flex items-center justify-center bg-accent opacity-60">
          <h3
            className="text-lg font-medium capitalize opacity-100"
            style={{ viewTransitionName: recipeViewTransitionName(slug) }}
          >
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
}
