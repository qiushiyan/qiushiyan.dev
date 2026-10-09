import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const data = [
  {
    id: 1,
    student_id: 1,
    quiz_id: 1,
    score: 90,
    date: "2024-10-30",
  },
  {
    id: 2,
    student_id: 1,
    quiz_id: 1,
    score: 80,
    date: "2024-10-30",
  },
  {
    id: 3,
    student_id: 2,
    quiz_id: 1,
    score: 70,
    date: "2024-10-30",
  },
  {
    id: 4,
    student_id: 3,
    quiz_id: 2,
    score: 100,
    date: "2024-10-30",
  },
  {
    id: 5,
    student_id: 4,
    quiz_id: 1,
    score: 80,
    date: "2024-11-01",
  },
  {
    id: 6,
    student_id: 2,
    quiz_id: 2,
    score: 90,
    date: "2024-11-02",
  },
];

const columns = ["id", "student_id", "quiz_id", "score", "date"] as const;

/** The example table in the Postgres duplicates post (static data, so no row hover). */
export function QuizTable() {
  return (
    <div className="not-prose my-8">
      <Table className="tabular-nums">
        <TableCaption>
          The <code>quiz_submissions</code> table, a student can submit the same
          quiz multiple times
        </TableCaption>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map((column) => (
              <TableHead key={column} className="font-mono">
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id} className="hover:bg-transparent">
              {columns.map((column) => (
                <TableCell key={column}>{row[column]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
