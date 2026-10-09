---
title: Working with Data Duplication in Postgres
slug: postgres-duplicates
date: '2024-11-02'
description: How to check, analyze and remove data duplication in Postgres
tags:
- Database
knitr:
  opts_chunk:
    collapse: true
    comment: '#'
draft: true
headings:
- title: Define Duplication
  slug: define-duplication
  depth: 2
- title: Check Duplication
  slug: check-duplication
  depth: 2
- title: Deduplication
  slug: deduplication
  depth: 2
- title: The Limitations of `SELECT DISTINCT`
  slug: the-limitations-of-select-distinct
  depth: 3
- title: '`DISTINCT ON` Clause'
  slug: distinct-on-clause
  depth: 3
---

## Define Duplication {#define-duplication}

In relational databases, data duplication usually means multiple records
that have the same values in all columns. They are considered an
anomaly, and we want to handle the duplicated records specially, such as
adding a flag, giving them less weight, or keeping only one row per
group.

However, the definition of duplication varies by domain. If you are
running an online survey, a participant (identified by IP address) can
fill out the form multiple times, but we might only want to count their
last submission. Then all previous submissions are duplicates,
regardless of whether the answers differ.

In this post, we will consider a table for storing the quiz submissions
of students in a university class. Each row represents a student’s
submission for a quiz, along with the score and the submission date. A
student may submit the same quiz multiple times.

## Check Duplication {#check-duplication}

<table>
<caption>The <code>quiz_submissions</code> table: a student can submit the same quiz multiple times</caption>
<thead><tr><th>id</th><th>student_id</th><th>quiz_id</th><th>score</th><th>date</th></tr></thead>
<tbody>
<tr><td>1</td><td>1</td><td>1</td><td>90</td><td>2024-10-30</td></tr>
<tr><td>2</td><td>1</td><td>1</td><td>80</td><td>2024-10-30</td></tr>
<tr><td>3</td><td>2</td><td>1</td><td>70</td><td>2024-10-30</td></tr>
<tr><td>4</td><td>3</td><td>2</td><td>100</td><td>2024-10-30</td></tr>
<tr><td>5</td><td>4</td><td>1</td><td>80</td><td>2024-11-01</td></tr>
<tr><td>6</td><td>2</td><td>2</td><td>90</td><td>2024-11-02</td></tr>
</tbody>
</table>

``` sql
CREATE TABLE quiz_submissions (
   id INTEGER PRIMARY KEY,
   student_id INTEGER NOT NULL,
   quiz_id INTEGER NOT NULL,
   score INTEGER NOT NULL,
   date DATE NOT NULL
);

-- Output:  0 rows
```

## Deduplication {#deduplication}

### The Limitations of `SELECT DISTINCT` {#the-limitations-of-select-distinct}

`SELECT DISTINCT` is a query modifier, available in most relational
databases, that removes rows whose columns are all identical to those of
another row.

To get the unique list of students who have submitted a quiz, we write
the following query:

``` sql
SELECT DISTINCT student_id
from quiz_submissions;

-- Output:  4 rows
| student_id|
|----------:|
|          3|
|          4|
|          2|
|          1|
```

How about the unique combinations of students and their scores? Just add
the `score` column to the column set:

``` sql
SELECT DISTINCT student_id, score
FROM quiz_submissions;

-- Output:  6 rows
| student_id| score|
|----------:|-----:|
|          2|    70|
|          1|    90|
|          2|    90|
|          3|   100|
|          4|    80|
|          1|    80|
```

Things get more complicated when we deduplicate rows within a subset
instead of the entire table. For example, say we want the latest score
of each student in each quiz. This is impossible with a single
`SELECT DISTINCT` statement: once you put all 3 columns in
`SELECT DISTINCT`, you get all the rows back.

This leads to a major downside of `SELECT DISTINCT`: you must use the
same set of columns for both duplication checks and column selection. So
you can’t get unique rows based on specific columns while getting the
associated data from other columns. For example,

Another problem of `SELECT DISTINCT` is that you are limited to using
the same column set to do both duplication checks and column selection.
For example, if we are asking the question “”

Postgres offers an additional `DISTINCT ON` clause that gives you more
flexibility.

### `DISTINCT ON` Clause {#distinct-on-clause}
