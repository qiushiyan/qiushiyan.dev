import { Note } from "#content";
import { Link } from "next-view-transitions";

import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { SiteNav } from "@/components/nav/site-nav";
import { getNotes } from "@/lib/content/notes";
import { noteViewTransitionName } from "@/lib/utils";

export default function NotesPage() {
  const notesGrouped = getNotes().reduce(
    (acc, note) => {
      const category = note.category || "Others";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(note);
      return acc;
    },
    {} as Record<string, Note[]>
  );

  const notes = Object.entries(notesGrouped);

  return (
    <>
      <SiteNav />
      <Container>
        <section aria-labelledby="notes-heading">
          <Heading id="notes-heading">Notes</Heading>
          <p className="text-muted-foreground">
            My notes on books, courses, etc.
          </p>
          <div className="mt-8 space-y-6">
            {notes.map(([category, notes]) => (
              <div key={category}>
                <h2 className="text-xl font-bold capitalize">{category}</h2>
                <ul className="mt-4 flex list-inside list-decimal flex-col gap-2">
                  {notes.map((note) => (
                    <li key={note.href}>
                      <Link href={note.href}>
                        <h3
                          className="inline-flex font-medium tracking-tight ~text-base/lg"
                          style={{
                            viewTransitionName: noteViewTransitionName(
                              note.slug
                            ),
                          }}
                        >
                          {note.title}
                        </h3>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}
