import { Link } from "next-view-transitions";

import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { SiteNav } from "@/components/nav/site-nav";
import { getNotes } from "@/lib/content/notes";
import { noteViewTransitionName } from "@/lib/utils";

export default function NotesPage() {
  return (
    <>
      <SiteNav />
      <Container>
        <section aria-labelledby="notes-heading">
          <Heading id="notes-heading">Notes</Heading>
          <p className="text-muted-foreground">
            My personal notes on books, courses, etc. Warning: they can be
            contextless and does not make sense to anyone but me, or maybe not
            even to me a month later.
          </p>
          <ul className="~gap-4/8 mt-4 flex flex-col">
            {getNotes().map((note) => (
              <li key={note.href}>
                <Link href={note.href} className="underline underline-offset-4">
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
      </Container>
    </>
  );
}
