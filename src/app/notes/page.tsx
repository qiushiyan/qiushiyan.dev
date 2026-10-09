import { IndexListGroup } from "@/components/index-list";
import { PageHeader } from "@/components/page-layout";
import { PageShell } from "@/components/page-shell";
import { getNotes } from "@/lib/content/notes";
import { noteViewTransitionName } from "@/lib/utils";
import type { Note } from "#content";
import type { Metadata } from "next";

const description = "Notes from books, courses and docs I've worked through.";

export const metadata: Metadata = {
  title: "Notes",
  description,
  openGraph: { type: "website", title: "Notes", description },
};

const OTHER = "Other";

export default function NotesPage() {
  const groups = Map.groupBy(
    getNotes(),
    (note: Note) => note.category || OTHER
  );
  const categories = [...groups.keys()].toSorted((a, b) =>
    a === OTHER ? 1 : b === OTHER ? -1 : a.localeCompare(b)
  );

  return (
    <PageShell>
      <PageHeader title="Notes" description={description} />
      {categories.map((category) => (
        <IndexListGroup
          key={category}
          label={category}
          items={groups.get(category)!.map((note) => ({
            href: note.href,
            title: note.title,
            viewTransitionName: noteViewTransitionName(note.slug),
            date: note.date,
          }))}
        />
      ))}
    </PageShell>
  );
}
