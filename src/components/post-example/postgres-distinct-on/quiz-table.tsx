import {
  Table,
  TableBody,
  TableCaption,
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

export function QuizTable() {
  return (
    <Table>
      <TableCaption>
        The <code>quiz_submissions</code> table, a student can submit the same
        quiz multiple times
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>
            <code>id</code>
          </TableHead>
          <TableHead>
            <code>student_id</code>
          </TableHead>
          <TableHead>
            <code>quiz_id</code>
          </TableHead>
          <TableHead>
            <code>score</code>
          </TableHead>
          <TableHead>
            <code>date</code>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.id}>
            <td>{row.id}</td>
            <td>{row.student_id}</td>
            <td>{row.quiz_id}</td>
            <td>{row.score}</td>
            <td>{row.date}</td>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
