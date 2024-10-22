import { recipes } from "#content";
import { Link } from "next-view-transitions";

import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { SiteNav } from "@/components/nav/site-nav";
import { routes } from "@/lib/navigation";
import { recipeViewTransitionName } from "@/lib/utils";
import { bgPattern } from "./patterns";

export default function RecipesPage() {
  return (
    <>
      <SiteNav />
      <Container>
        <section aria-labelledby="recipes-heading">
          <Heading id="recipes-heading">Recipes</Heading>
          <p className="text-muted-foreground">
            Miscellaneous code snippets in various languages and frameworks. You
            are welcome to copy and use them however you like.
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
